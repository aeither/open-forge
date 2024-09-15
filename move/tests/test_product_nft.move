#[test_only]
module aptos_friend_addr::test_product_nft {
    use std::string;
    use std::signer;
    use aptos_framework::account;
    use aptos_framework::object;
    use aptos_token_objects::token;
    use aptos_friend_addr::product_nft;

    #[test(creator = @0x123, user = @0x456)]
    public fun test_product_collection(creator: &signer, user: &signer) {
        // Setup
        account::create_account_for_test(signer::address_of(creator));
        account::create_account_for_test(signer::address_of(user));

        // Create collection
        product_nft::create_collection(creator);

        // Mint product
        let name = string::utf8(b"Test Product");
        let description = string::utf8(b"This is a test product");
        let uri = string::utf8(b"https://test-product.com/image.jpg");
        product_nft::mint_product(creator, name, description, uri);

        // Get the product token object
        let token_address = token::create_token_address(
            &signer::address_of(creator),
            &string::utf8(b"Product Showcase"),
            &name
        );
        let product_object = object::address_to_object<token::Token>(token_address);

        // Modify product description
        let new_description = string::utf8(b"Updated test product description");
        product_nft::modify_product_description(creator, product_object, new_description);

        // Upvote product
        product_nft::upvote_product(creator, product_object, 5);

        // Check upvote count
        let upvote_count = product_nft::get_upvote_count(product_object);
        assert!(upvote_count == 6, 0); // Initial count (1) + 5 upvotes

        // Transfer product to user
        product_nft::transfer(creator, product_object, signer::address_of(user));

        // Verify new owner
        assert!(object::is_owner(product_object, signer::address_of(user)), 1);
    }
}