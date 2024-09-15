#[test_only]
module aptos_friend_addr::test_product_nft {
    use std::string;
    use std::signer;
    use aptos_framework::account;
    use aptos_framework::object;
    use aptos_token_objects::token;
    use aptos_friend_addr::product_nft;

    #[test(creator = @aptos_friend_addr, user = @0x456)]
    public fun test_product_collection(creator: &signer, user: &signer) {
        // Setup
        account::create_account_for_test(signer::address_of(creator));
        account::create_account_for_test(signer::address_of(user));

        // Initialize the module (this will create the collection)
        product_nft::init_module_for_test(creator);

        // Mint product
        let name = string::utf8(b"Test Product");
        let description = string::utf8(b"This is a test product");
        let uri = string::utf8(b"https://test-product.com/image.jpg");
        product_nft::mint_product(creator, name, description, uri);

        // Get the product token object
        let product_object = product_nft::get_product_obj(signer::address_of(creator), name);

        // Modify product description
        let new_description = string::utf8(b"Updated test product description");
        product_nft::modify_product_description(creator, product_object, new_description);

        // Upvote product
        product_nft::upvote_product(creator, product_object);

        // Check upvote count
        let upvote_count = product_nft::get_upvote_count(product_object);
        assert!(upvote_count == 2, 0); // Initial count (1) + 1 upvote

        // Transfer product to user
        product_nft::transfer(creator, product_object, signer::address_of(user));

        // Verify new owner
        assert!(object::is_owner(product_object, signer::address_of(user)), 1);
    }

    #[test(creator = @aptos_friend_addr)]
    public fun test_mint_two(creator: &signer) {
        // Setup
        account::create_account_for_test(signer::address_of(creator));

        // Initialize the module (this will create the collection)
        product_nft::init_module_for_test(creator);

        // Mint product
        let name = string::utf8(b"Test Product");
        let description = string::utf8(b"This is a test product");
        let uri = string::utf8(b"https://test-product.com/image.jpg");
        product_nft::mint_product(creator, name, description, uri);

        // Attempt to mint a different product. Must use different name
        let name2 = string::utf8(b"Test Product 2");
        product_nft::mint_product(creator, name2, description, uri);
    }
}