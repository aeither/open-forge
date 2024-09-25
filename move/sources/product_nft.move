module aptos_friend_addr::product_nft {
    use std::string::{Self, String};
    use std::string::utf8;
    use std::signer;
    use std::option::{Self};
    use std::error;
    use std::vector;
    use std::debug::print;

    use aptos_std::string_utils;

    use aptos_framework::object::{Self, Object, ExtendRef};
    use aptos_framework::resource_account;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;
    use aptos_framework::randomness;

    use aptos_token_objects::token::{Self, Token};
    use aptos_token_objects::collection;
    use aptos_token_objects::property_map;

    const MAX_DESCRIPTION_LENGTH: u64 = 2000;
    const EDESCRIPTION_TOO_LONG: u64 = 1;

    const APP_OBJECT_SEED: vector<u8> = b"OPEN_FORGE";

    const PRODUCT_STATUS: vector<u8> = b"Product Status";
    const UPVOTE_COUNT: vector<u8> = b"Upvote Count";
    const STATUS_TRENDING: vector<u8> = b"Trending";
    const STATUS_NEW: vector<u8> = b"New";

    // openssl rand -hex 3
    const COLLECTION_NAME: vector<u8> = b"Open Forge - 20c920";
    const COLLECTION_DESCRIPTION: vector<u8> = b"Open Forge Products Collection";
    const COLLECTION_URI: vector<u8> = b"https://aptos-open-forge-dev-demo.com";

    struct CollectionMutatorStore has key {
        mutator_ref: collection::MutatorRef,
        collection_name: String
    }

    struct MintTracker has key {
        total_minted: u64,
        last_random_id: u64
    }

    struct TokenMutatorStore has key {
        mutator_ref: token::MutatorRef,
        property_mutator_ref: property_map::MutatorRef,
        token_name: String,
        long_description: String,
        social_url: String,
        value: u64,
        id: u64
    }

    #[event]
    struct NewProductEvent has drop, store {
        token_name: String,
        creator_addr: address
    }

    #[event]
    struct UpvoteUpdate has drop, store {
        upvoter: address,
        product_name: String,
        timestamp: u64,
        product_addr: address,
        new_upvotes: u64
    }

    struct ObjectController has key {
        app_extend_ref: ExtendRef
    }

    fun init_module(account: &signer) {
        let constructor_ref = object::create_named_object(account, APP_OBJECT_SEED);
        let extend_ref = object::generate_extend_ref(&constructor_ref);
        let app_signer = &object::generate_signer(&constructor_ref);

        move_to(app_signer, ObjectController { app_extend_ref: extend_ref });
        move_to(app_signer, MintTracker { total_minted: 0, last_random_id: 0 });

        create_collection(app_signer);
    }

    // #[randomness]
    fun create_collection(creator: &signer) {

        // let chars = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        // let random_suffix = vector::empty<u8>();
        // let i = 0;
        // while (i < 6) {
        //     let random_index = randomness::u8_range(0, 62); // 62 is the length of chars
        //     let char = *vector::borrow(&chars, (random_index as u64));
        //     vector::push_back(&mut random_suffix, char);
        //     i = i + 1;
        // };

        // let collection_name_with_suffix = string::utf8(b"");
        // string::append(&mut collection_name_with_suffix, collection_name);
        // string::append(&mut collection_name_with_suffix, string::utf8(b" - "));
        // string::append(&mut collection_name_with_suffix, string::utf8(random_suffix));

        let royalty = option::none();
        let collection_constructor_ref =
            &collection::create_unlimited_collection(
                creator,
                utf8(COLLECTION_DESCRIPTION),
                utf8(COLLECTION_NAME),
                royalty,
                utf8(COLLECTION_URI)
            );

        let mutator_ref = collection::generate_mutator_ref(collection_constructor_ref);
        move_to(
            creator,
            CollectionMutatorStore { mutator_ref, collection_name: utf8(COLLECTION_NAME) }
        );

    }

    public entry fun mint_product(
        user: &signer,
        name: String,
        description: String,
        uri: String,
        long_description: String,
        social_url: String
    ) acquires ObjectController, CollectionMutatorStore, MintTracker {
        let creator_address = get_app_signer_addr();
        let collection_store = borrow_global<CollectionMutatorStore>(creator_address);

        log(&b"mint_product -> collection_name", &collection_store.collection_name);

        let token_constructor_ref =
            token::create_named_token(
                &get_app_signer(),
                collection_store.collection_name,
                description,
                name,
                option::none(),
                uri
            );

        let token_signer = object::generate_signer(&token_constructor_ref);
        let mutator_ref = token::generate_mutator_ref(&token_constructor_ref);
        let property_mutator_ref =
            property_map::generate_mutator_ref(&token_constructor_ref);
        let transfer_ref = object::generate_transfer_ref(&token_constructor_ref);

        let properties = property_map::prepare_input(vector[], vector[], vector[]);
        property_map::init(&token_constructor_ref, properties);

        property_map::add_typed(
            &property_mutator_ref,
            string::utf8(PRODUCT_STATUS),
            string::utf8(STATUS_NEW)
        );
        property_map::add_typed(
            &property_mutator_ref,
            string::utf8(UPVOTE_COUNT),
            1
        );

        let creator_address = get_app_signer_addr();
        let mint_tracker = borrow_global_mut<MintTracker>(creator_address);
        mint_tracker.total_minted = mint_tracker.total_minted + 1;

        move_to(
            &token_signer,
            TokenMutatorStore {
                mutator_ref,
                property_mutator_ref,
                token_name: name,
                long_description,
                social_url,
                value: 1,
                id: mint_tracker.total_minted
            }
        );

        event::emit<NewProductEvent>(
            NewProductEvent { token_name: name, creator_addr: signer::address_of(user) }
        );

        object::transfer_with_ref(
            object::generate_linear_transfer_ref(&transfer_ref),
            signer::address_of(user)
        );
    }

    public entry fun modify_product_description(
        owner: &signer, product_name: String, new_description: String
    ) acquires CollectionMutatorStore, TokenMutatorStore {
        assert!(
            string::length(&new_description) <= MAX_DESCRIPTION_LENGTH,
            error::out_of_range(EDESCRIPTION_TOO_LONG)
        );

        let owner_address = signer::address_of(owner);
        let product_object = get_product_obj(product_name);
        assert!(object::is_owner(product_object, owner_address), 0);

        let product_address = object::object_address(&product_object);

        let token_mutator_store = borrow_global<TokenMutatorStore>(product_address);

        token::set_description(&token_mutator_store.mutator_ref, new_description);
    }

    public entry fun modify_product_details(
        owner: &signer,
        product_name: String,
        new_long_description: String,
        new_social_url: String
    ) acquires CollectionMutatorStore, TokenMutatorStore {
        assert!(
            string::length(&new_long_description) <= MAX_DESCRIPTION_LENGTH,
            error::out_of_range(EDESCRIPTION_TOO_LONG)
        );

        let owner_address = signer::address_of(owner);
        let product_object = get_product_obj(product_name);
        assert!(object::is_owner(product_object, owner_address), 0);

        let product_address = object::object_address(&product_object);
        let token_mutator_store = borrow_global_mut<TokenMutatorStore>(product_address);

        token_mutator_store.long_description = new_long_description;
        token_mutator_store.social_url = new_social_url;
    }

    public entry fun upvote_product(
        user: &signer, name: String
    ) acquires CollectionMutatorStore, TokenMutatorStore {
        let upvoter_address = signer::address_of(user);
        let product_address = get_product_address(name);

        let product = borrow_global_mut<TokenMutatorStore>(product_address);
        let old_upvotes = product.value;
        let new_upvotes = old_upvotes + 1;
        product.value = new_upvotes;

        property_map::update_typed(
            &product.property_mutator_ref,
            &string::utf8(UPVOTE_COUNT),
            new_upvotes
        );

        let new_status = if (new_upvotes > 100) {
            STATUS_TRENDING
        } else {
            STATUS_NEW
        };

        property_map::update_typed(
            &product.property_mutator_ref,
            &string::utf8(PRODUCT_STATUS),
            string::utf8(new_status)
        );

        let product_name = product.token_name;

        event::emit(
            UpvoteUpdate {
                upvoter: upvoter_address,
                product_name,
                product_addr: product_address,
                new_upvotes,
                timestamp: timestamp::now_seconds()
            }
        );
    }

    public entry fun transfer<T: key>(
        owner: &signer, object: Object<T>, to: address
    ) {
        let owner_address = signer::address_of(owner);
        assert!(object::is_owner(object, owner_address), 0);
        object::transfer(owner, object, to);
    }

    fun get_app_signer(): signer acquires ObjectController {
        object::generate_signer_for_extending(
            &borrow_global<ObjectController>(get_app_signer_addr()).app_extend_ref
        )
    }

    #[randomness]
    entry fun set_random_product_id() acquires MintTracker {
        let creator_address = get_app_signer_addr();
        let mint_tracker = borrow_global_mut<MintTracker>(creator_address);
        let total_minted = mint_tracker.total_minted;

        if (total_minted == 0) {
            mint_tracker.last_random_id = 0;
        } else {
            // Use u64_range to get a random number between 1 and total_minted (inclusive)
            mint_tracker.last_random_id = aptos_framework::randomness::u64_range(
                1, total_minted + 1
            );
        };
    }

    #[view]
    public fun get_random_product_id(): u64 acquires MintTracker {
        let creator_address = get_app_signer_addr();
        let mint_tracker = borrow_global<MintTracker>(creator_address);
        mint_tracker.last_random_id
    }

    //  entry fun getRandomProduct(): Object<Token> acquires MintTracker, CollectionMutatorStore {
    //     let random_id = getRandomProductId();

    //     if (random_id == 0) {
    //         // No products minted yet
    //         abort 0
    //     };

    //     let creator_address = get_app_signer_addr();
    //     let collection_store = borrow_global<CollectionMutatorStore>(creator_address);
    //     let collection_name = collection_store.collection_name;

    //     // Iterate through all minted tokens to find the one with the matching id
    //     let i = 1;
    //     while (i <= random_id) {
    //         let token_name = string_utils::format2(&b"{}", i);
    //         let token_address = token::create_token_address(
    //             &creator_address,
    //             &collection_name,
    //             &token_name
    //         );

    //         if (exists<TokenMutatorStore>(token_address)) {
    //             let token_store = borrow_global<TokenMutatorStore>(token_address);
    //             if (token_store.id == random_id) {
    //                 return object::address_to_object<Token>(token_address)
    //             };
    //         };

    //         i = i + 1;
    //     };

    //     // This should never happen if the random_id is valid
    //     abort 1
    // }

    #[view]
    public fun get_app_signer_addr(): address {
        object::create_object_address(&@aptos_friend_addr, APP_OBJECT_SEED)
    }

    #[view]
    public fun get_upvote_count(
        product_name: String
    ): u64 acquires CollectionMutatorStore, TokenMutatorStore {
        // let product_address = object::object_address(&product_object);

        let product_address = get_product_address(product_name);
        borrow_global<TokenMutatorStore>(product_address).value
    }

    #[view]
    public fun get_product_address(name: String): (address) acquires CollectionMutatorStore {
        let creator_address = get_app_signer_addr();
        let collection_store = borrow_global<CollectionMutatorStore>(creator_address);

        let creator_addr = get_app_signer_addr();
        let token_address =
            token::create_token_address(
                &creator_addr,
                &collection_store.collection_name,
                &name
            );
        token_address
    }

    #[view]
    public fun get_product_obj(name: String): Object<token::Token> acquires CollectionMutatorStore {
        let creator_address = get_app_signer_addr();
        let collection_store = borrow_global<CollectionMutatorStore>(creator_address);

        let token_address =
            token::create_token_address(
                &creator_address,
                &collection_store.collection_name,
                &name
            );
        object::address_to_object<token::Token>(token_address)
    }

    #[view]
    public fun get_collection_name(): String acquires CollectionMutatorStore {
        let creator_address = get_app_signer_addr();
        let collection_store = borrow_global<CollectionMutatorStore>(creator_address);

        collection_store.collection_name
    }

    // Utils
    fun log(prefix: &vector<u8>, value: &String) {
        let full_message = vector::empty<u8>();
        vector::append(&mut full_message, *prefix);
        vector::append(&mut full_message, b": ");
        vector::append(&mut full_message, *string::bytes(value));
        print(&string::utf8(full_message));
    }

    // Tests
    #[test_only]
    use aptos_std::crypto_algebra::enable_cryptography_algebra_natives;

    #[test_only]
    fun setup_test(fx: &signer, aptos: &signer, account: &signer) {
        enable_cryptography_algebra_natives(fx);
        randomness::initialize_for_testing(fx);
        randomness::set_seed(
            x"0000000000000000000000000000000000000000000000000000000000000004"
        );
        account::create_account_for_test(signer::address_of(account));

        timestamp::set_time_has_started_for_testing(aptos);
        init_module(account);
    }

    #[test(fx = @aptos_framework, aptos = @0x1, creator = @aptos_friend_addr)]
    fun test_random_collection_name(
        fx: &signer, aptos: &signer, creator: &signer
    ) acquires CollectionMutatorStore {
        // Setup
        setup_test(fx, aptos, creator);

        // Assert that the collection was created
        let app_signer_addr = get_app_signer_addr();
        assert!(exists<CollectionMutatorStore>(app_signer_addr), 0);

        // Check that the collection name is as expected
        let collection_store = borrow_global<CollectionMutatorStore>(app_signer_addr);
        let collection_name = collection_store.collection_name;

        assert!(collection_name == string::utf8(COLLECTION_NAME), 1);
    }

    #[test(
        fx = @aptos_framework, aptos = @0x1, creator = @aptos_friend_addr, user = @0x456
    )]
    public fun test_product_collection(
        fx: &signer,
        aptos: &signer,
        creator: &signer,
        user: &signer
    ) acquires ObjectController, CollectionMutatorStore, TokenMutatorStore, MintTracker {
        // Setup
        setup_test(fx, aptos, creator);
        account::create_account_for_test(signer::address_of(user));

        // Mint product
        let product_name = string::utf8(b"Test Product");
        let description = string::utf8(b"This is a test product");
        let uri = string::utf8(b"https://test-product.com/image.jpg");
        let long_description = string::utf8(
            b"This is a longer description for the test product"
        );
        let social_url = string::utf8(b"https://twitter.com/testproduct");
        mint_product(
            creator,
            product_name,
            description,
            uri,
            long_description,
            social_url
        );

        // Check total_minted
        let creator_address = get_app_signer_addr();
        let mint_tracker = borrow_global<MintTracker>(creator_address);
        assert!(mint_tracker.total_minted == 1, 2);

        // Modify product description
        let new_description = string::utf8(b"Updated test product description");
        modify_product_description(creator, product_name, new_description);

        // Modify product details
        let new_long_description = string::utf8(b"This is an updated longer description");
        let new_social_url = string::utf8(b"https://facebook.com/testproduct");
        modify_product_details(
            creator, product_name, new_long_description, new_social_url
        );

        // Upvote product
        upvote_product(creator, product_name);

        // Check upvote count
        let upvote_count = get_upvote_count(product_name);
        assert!(upvote_count == 2, 0); // Initial count (1) + 1 upvote

        let product_object = get_product_obj(product_name);

        // Verify owner
        assert!(object::is_owner(product_object, signer::address_of(creator)), 1);
    }

    #[test(
        fx = @aptos_framework, aptos = @0x1, creator = @aptos_friend_addr, user = @0x456
    )]
    public fun test_mint_two(
        fx: &signer,
        aptos: &signer,
        creator: &signer,
        user: &signer
    ) acquires ObjectController, CollectionMutatorStore, MintTracker {
        // Setup
        setup_test(fx, aptos, creator);
        account::create_account_for_test(signer::address_of(user));

        // Mint product
        let name = string::utf8(b"Test Product");
        let description = string::utf8(b"This is a test product");
        let uri = string::utf8(b"https://test-product.com/image.jpg");
        let long_description = string::utf8(b"Long description for test product");
        let social_url = string::utf8(b"https://twitter.com/testproduct");
        mint_product(creator, name, description, uri, long_description, social_url);

        // Attempt to mint a different product. Must use different name
        let name2 = string::utf8(b"Test Product 2");
        let long_description2 = string::utf8(b"Long description for test product 2");
        let social_url2 = string::utf8(b"https://twitter.com/testproduct2");
        mint_product(creator, name2, description, uri, long_description2, social_url2);
    }

    #[test(fx = @aptos_framework, aptos = @0x1, creator = @aptos_friend_addr)]
    fun test_random_product_id(
        fx: &signer, aptos: &signer, creator: &signer
    ) acquires ObjectController, CollectionMutatorStore, MintTracker {
        // Setup
        setup_test(fx, aptos, creator);

        // Mint some products
        let product_name1 = string::utf8(b"Test Product 1");
        let product_name2 = string::utf8(b"Test Product 2");
        let description = string::utf8(b"This is a test product");
        let uri = string::utf8(b"https://test-product.com/image.jpg");
        let long_description = string::utf8(b"Long description for test product");
        let social_url = string::utf8(b"https://twitter.com/testproduct");

        mint_product(
            creator,
            product_name1,
            description,
            uri,
            long_description,
            social_url
        );
        mint_product(
            creator,
            product_name2,
            description,
            uri,
            long_description,
            social_url
        );

        // Set a random product ID
        set_random_product_id();

        // Get the random product ID
        let random_id = get_random_product_id();

        // Assert that the random ID is within the expected range
        assert!(random_id > 0 && random_id <= 2, 0);

        // Test when no products are minted
        let creator_address = get_app_signer_addr();
        let mint_tracker = borrow_global_mut<MintTracker>(creator_address);
        mint_tracker.total_minted = 0;

        set_random_product_id();
        let random_id = get_random_product_id();
        assert!(random_id == 0, 1);
    }
}
