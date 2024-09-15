module aptos_friend_addr::product_nft {
    use std::string::{Self, String};
    use std::string::utf8;
    use std::signer;
    use std::option::{Self};
    use std::error;

    use aptos_framework::object::{Self, Object};
    use aptos_framework::resource_account;
    use aptos_framework::account;
    use aptos_framework::event;

    use aptos_token_objects::token;
    use aptos_token_objects::collection;
    use aptos_token_objects::property_map;

    const MAX_DESCRIPTION_LENGTH: u64 = 2000;
    const EDESCRIPTION_TOO_LONG: u64 = 1;

    const PRODUCT_STATUS: vector<u8> = b"Product Status";
    const UPVOTE_COUNT: vector<u8> = b"Upvote Count";
    const STATUS_TRENDING: vector<u8> = b"Trending";
    const STATUS_NEW: vector<u8> = b"New";

    const COLLECTION_DESCRIPTION: vector<u8> = b"Product Hunt NFT Collection";
    const COLLECTION_NAME: vector<u8> = b"Product Showcase";
    const COLLECTION_URI: vector<u8> = b"https://productshowcase.com";

    struct CollectionMutatorStore has key {
        mutator_ref: collection::MutatorRef
    }

    struct TokenMutatorStore has key {
        mutator_ref: token::MutatorRef,
        property_mutator_ref: property_map::MutatorRef,
        token_name: String
    }

    struct UpvoteCount has key {
        value: u64
    }

    #[event]
    struct UpvoteUpdate has drop, store {
        product: address,
        old_upvotes: u64,
        new_upvotes: u64
    }

    public entry fun create_collection(creator: &signer) {
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

        move_to(creator, CollectionMutatorStore { mutator_ref });
    }

    public entry fun mint_product(
        creator: &signer,
        name: String,
        description: String,
        uri: String
    ) {
        let royalty = option::none();

        let token_constructor_ref =
            &token::create_named_token(
                creator,
                utf8(COLLECTION_NAME),
                description,
                name,
                royalty,
                uri
            );

        let mutator_ref = token::generate_mutator_ref(token_constructor_ref);
        let property_mutator_ref =
            property_map::generate_mutator_ref(token_constructor_ref);

        let properties = property_map::prepare_input(vector[], vector[], vector[]);
        property_map::init(token_constructor_ref, properties);

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

        move_to(
            creator,
            TokenMutatorStore { mutator_ref, property_mutator_ref, token_name: name }
        );

        let object_signer = object::generate_signer(token_constructor_ref);
        move_to(&object_signer, UpvoteCount { value: 1 });
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

        let TokenMutatorStore { mutator_ref, property_mutator_ref, token_name } =
            move_from<TokenMutatorStore>(owner_address);

        token::set_description(&mutator_ref, new_description);

        move_to(
            owner,
            TokenMutatorStore { mutator_ref, property_mutator_ref, token_name }
        );
    }

    public entry fun upvote_product(
        user: &signer, product_object: Object<token::Token>
    ) acquires TokenMutatorStore, UpvoteCount {
        let owner_address = signer::address_of(user);
        assert!(object::is_owner(product_object, owner_address), 0);

        let product_address = object::object_address(&product_object);

        let upvote_count = borrow_global_mut<UpvoteCount>(product_address);
        let old_upvotes = upvote_count.value;
        let new_upvotes = old_upvotes + 1;
        upvote_count.value = new_upvotes;

        let TokenMutatorStore { mutator_ref: _, property_mutator_ref, token_name: _ } =
            borrow_global<TokenMutatorStore>(owner_address);

        property_map::update_typed(
            property_mutator_ref,
            &string::utf8(UPVOTE_COUNT),
            new_upvotes
        );

        let new_status = if (new_upvotes > 100) {
            STATUS_TRENDING
        } else {
            STATUS_NEW
        };

        property_map::update_typed(
            property_mutator_ref,
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
    public fun get_upvote_count(product_object: Object<token::Token>): u64 acquires UpvoteCount {
        let product_address = object::object_address(&product_object);
        borrow_global<UpvoteCount>(product_address).value
    }

    #[view]
    public fun get_product_obj(
        creator_addr: address, name: String, collection_name: String
    ): Object<token::Token> {
        let token_address =
            token::create_token_address(
                &creator_addr,
                &collection_name,
                &name
            );
        object::address_to_object<token::Token>(token_address)
    }
}
