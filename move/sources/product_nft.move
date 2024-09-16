module aptos_friend_addr::product_nft {
    use std::string::{Self, String};
    use std::string::utf8;
    use std::signer;
    use std::option::{Self};
    use std::error;
    use std::vector;
    use std::debug::print;

    use aptos_std::string_utils;

    use aptos_framework::object::{Self, Object};
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

    const PRODUCT_STATUS: vector<u8> = b"Product Status";
    const UPVOTE_COUNT: vector<u8> = b"Upvote Count";
    const STATUS_TRENDING: vector<u8> = b"Trending";
    const STATUS_NEW: vector<u8> = b"New";

    const COLLECTION_DESCRIPTION: vector<u8> = b"Open Forge Products Collection";
    const COLLECTION_URI: vector<u8> = b"https://aptos-open-forge-dev-demo.com";

    struct CollectionMutatorStore has key {
        mutator_ref: collection::MutatorRef,
        collection_name: String
    }

    struct TokenMutatorStore has key {
        mutator_ref: token::MutatorRef,
        property_mutator_ref: property_map::MutatorRef,
        token_name: String,
        value: u64
    }

    #[event]
    struct UpvoteUpdate has drop, store {
        product: address,
        old_upvotes: u64,
        new_upvotes: u64
    }

    // fun init_module(resource_account: &signer) {
    //     let collection_name = utf8(b"Open Forge");
    //     create_collection(resource_account, collection_name);
    // }

    #[randomness]
    entry fun create_collection(creator: &signer) {
        let collection_name = utf8(b"Open Forge");

        let chars = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let random_suffix = vector::empty<u8>();
        let i = 0;
        while (i < 6) {
            let random_index = randomness::u8_range(0, 62); // 62 is the length of chars
            let char = *vector::borrow(&chars, (random_index as u64));
            vector::push_back(&mut random_suffix, char);
            i = i + 1;
        };

        let collection_name_with_suffix = string::utf8(b"");
        string::append(&mut collection_name_with_suffix, collection_name);
        string::append(&mut collection_name_with_suffix, string::utf8(b" - "));
        string::append(&mut collection_name_with_suffix, string::utf8(random_suffix));

        let royalty = option::none();
        let collection_constructor_ref =
            &collection::create_unlimited_collection(
                creator,
                utf8(COLLECTION_DESCRIPTION),
                collection_name_with_suffix,
                royalty,
                utf8(COLLECTION_URI)
            );

        let mutator_ref = collection::generate_mutator_ref(collection_constructor_ref);
        move_to(
            creator,
            CollectionMutatorStore {
                mutator_ref,
                collection_name: collection_name_with_suffix
            }
        );

    }

    public entry fun mint_product(
        creator: &signer,
        name: String,
        description: String,
        uri: String
    ) acquires CollectionMutatorStore {
        let creator_address = signer::address_of(creator);
        let collection_store = borrow_global<CollectionMutatorStore>(creator_address);

        log(&b"mint_product -> collection_name", &collection_store.collection_name);

        let token_constructor_ref =
            token::create_named_token(
                creator,
                collection_store.collection_name,
                description,
                name,
                option::none(),
                uri
            );

        let mutator_ref = token::generate_mutator_ref(&token_constructor_ref);
        let property_mutator_ref =
            property_map::generate_mutator_ref(&token_constructor_ref);

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

        let object_signer = object::generate_signer(&token_constructor_ref);
        move_to(
            &object_signer,
            TokenMutatorStore {
                mutator_ref,
                property_mutator_ref,
                token_name: name,
                value: 1
            }
        );
    }

    public entry fun modify_product_description(
        owner: &signer, product_object: Object<token::Token>, new_description: String
    ) acquires TokenMutatorStore {
        assert!(
            string::length(&new_description) <= MAX_DESCRIPTION_LENGTH,
            error::out_of_range(EDESCRIPTION_TOO_LONG)
        );

        let owner_address = signer::address_of(owner);
        assert!(object::is_owner(product_object, owner_address), 0);

        let product_address = object::object_address(&product_object);

        let token_mutator_store = borrow_global<TokenMutatorStore>(product_address);

        token::set_description(&token_mutator_store.mutator_ref, new_description);
    }

    public entry fun upvote_product(
        user: &signer, product_object: Object<token::Token>
    ) acquires TokenMutatorStore {
        let owner_address = signer::address_of(user);
        assert!(object::is_owner(product_object, owner_address), 0);

        let product_address = object::object_address(&product_object);

        let upvote_count = borrow_global_mut<TokenMutatorStore>(product_address);
        let old_upvotes = upvote_count.value;
        let new_upvotes = old_upvotes + 1;
        upvote_count.value = new_upvotes;

        let token_mutator_store = borrow_global<TokenMutatorStore>(product_address);

        property_map::update_typed(
            &token_mutator_store.property_mutator_ref,
            &string::utf8(UPVOTE_COUNT),
            new_upvotes
        );

        let new_status = if (new_upvotes > 100) {
            STATUS_TRENDING
        } else {
            STATUS_NEW
        };

        property_map::update_typed(
            &token_mutator_store.property_mutator_ref,
            &string::utf8(PRODUCT_STATUS),
            string::utf8(new_status)
        );

        event::emit(UpvoteUpdate { product: product_address, old_upvotes, new_upvotes });
    }

    public entry fun transfer<T: key>(
        owner: &signer, object: Object<T>, to: address
    ) {
        let owner_address = signer::address_of(owner);
        assert!(object::is_owner(object, owner_address), 0);
        object::transfer(owner, object, to);
    }

    #[view]
    public fun get_upvote_count(
        product_object: Object<token::Token>
    ): u64 acquires TokenMutatorStore {
        let product_address = object::object_address(&product_object);
        borrow_global<TokenMutatorStore>(product_address).value
    }

    #[view]
    public fun get_product_obj(
        creator_addr: address, name: String
    ): Object<token::Token> acquires CollectionMutatorStore {
        let collection_store = borrow_global<CollectionMutatorStore>(creator_addr);
        let token_address =
            token::create_token_address(
                &creator_addr,
                &collection_store.collection_name,
                &name
            );
        object::address_to_object<token::Token>(token_address)
    }

    #[view]
    public fun get_collection_name(creator_addr: address): String acquires CollectionMutatorStore {
        let collection_store = borrow_global<CollectionMutatorStore>(creator_addr);
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
    fun setup_test(fx: &signer, account: &signer) {
        enable_cryptography_algebra_natives(fx);
        randomness::initialize_for_testing(fx);
        randomness::set_seed(
            x"0000000000000000000000000000000000000000000000000000000000000004"
        );
        account::create_account_for_test(signer::address_of(account));
    }

    #[test_only]
    public fun create_collection_with_randomness(creator: &signer) {
        create_collection(creator);
    }

    #[test(fx = @aptos_framework, creator = @aptos_friend_addr)]
    fun test_random_collection_name(fx: &signer, creator: &signer) acquires CollectionMutatorStore {
        // Setup
        setup_test(fx, creator);

        // Call init_module
        create_collection_with_randomness(creator);

        // Assert that the collection was created
        let creator_address = signer::address_of(creator);
        assert!(exists<CollectionMutatorStore>(creator_address), 0);

        // Check that the collection name is unique
        let collection_store = borrow_global<CollectionMutatorStore>(creator_address);
        let collection_name = collection_store.collection_name;
        print(&collection_name);
        assert!(
            string::length(&collection_name) > string::length(&utf8(b"Open Forge")),
            1
        );

        print(&string::index_of(&collection_name, &utf8(b"Open Forge")));
        assert!(string::index_of(&collection_name, &utf8(b"Open Forge")) == 0, 2);
    }

    #[test(fx = @aptos_framework, creator = @aptos_friend_addr, user = @0x456)]
    public fun test_product_collection(
        fx: &signer, creator: &signer, user: &signer
    ) acquires CollectionMutatorStore, TokenMutatorStore {
        // Setup
        setup_test(fx, creator);
        account::create_account_for_test(signer::address_of(user));

        // Initialize the module (this will create the collection)
        create_collection_with_randomness(creator);

        // Mint product
        let name = string::utf8(b"Test Product");
        let description = string::utf8(b"This is a test product");
        let uri = string::utf8(b"https://test-product.com/image.jpg");
        mint_product(creator, name, description, uri);

        // Get the product token object
        let product_object = get_product_obj(signer::address_of(creator), name);

        // Modify product description
        let new_description = string::utf8(b"Updated test product description");
        modify_product_description(creator, product_object, new_description);

        // Upvote product
        upvote_product(creator, product_object);

        // Check upvote count
        let upvote_count = get_upvote_count(product_object);
        assert!(upvote_count == 2, 0); // Initial count (1) + 1 upvote

        // Transfer product to user
        transfer(creator, product_object, signer::address_of(user));

        // Verify new owner
        assert!(object::is_owner(product_object, signer::address_of(user)), 1);
    }

    #[test(fx = @aptos_framework, creator = @aptos_friend_addr)]
    public fun test_mint_two(fx: &signer, creator: &signer) acquires CollectionMutatorStore {
        // Setup
        setup_test(fx, creator);

        // Initialize the module (this will create the collection)
        create_collection_with_randomness(creator);

        // Mint product
        let name = string::utf8(b"Test Product");
        let description = string::utf8(b"This is a test product");
        let uri = string::utf8(b"https://test-product.com/image.jpg");
        mint_product(creator, name, description, uri);

        // Attempt to mint a different product. Must use different name
        let name2 = string::utf8(b"Test Product 2");
        mint_product(creator, name2, description, uri);
    }
}
