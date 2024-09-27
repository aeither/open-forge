export const ABI = {"address":"0x3937fa049f5d8ec5ea9e17b042788f20110b99741ee2c13c1255f0b066f92d67","name":"product_nft","friends":[],"exposed_functions":[{"name":"get_app_signer_addr","visibility":"public","is_entry":false,"is_view":true,"generic_type_params":[],"params":[],"return":["address"]},{"name":"get_collection_name","visibility":"public","is_entry":false,"is_view":true,"generic_type_params":[],"params":[],"return":["0x1::string::String"]},{"name":"get_product_address","visibility":"public","is_entry":false,"is_view":true,"generic_type_params":[],"params":["0x1::string::String"],"return":["address"]},{"name":"get_product_obj","visibility":"public","is_entry":false,"is_view":true,"generic_type_params":[],"params":["0x1::string::String"],"return":["0x1::object::Object<0x4::token::Token>"]},{"name":"get_random_product_id","visibility":"public","is_entry":false,"is_view":true,"generic_type_params":[],"params":[],"return":["u64"]},{"name":"get_upvote_count","visibility":"public","is_entry":false,"is_view":true,"generic_type_params":[],"params":["0x1::string::String"],"return":["u64"]},{"name":"mint_product","visibility":"public","is_entry":true,"is_view":false,"generic_type_params":[],"params":["&signer","0x1::string::String","0x1::string::String","0x1::string::String","0x1::string::String","0x1::string::String"],"return":[]},{"name":"modify_product_description","visibility":"public","is_entry":true,"is_view":false,"generic_type_params":[],"params":["&signer","0x1::string::String","0x1::string::String"],"return":[]},{"name":"modify_product_details","visibility":"public","is_entry":true,"is_view":false,"generic_type_params":[],"params":["&signer","0x1::string::String","0x1::string::String","0x1::string::String"],"return":[]},{"name":"set_random_product_id","visibility":"private","is_entry":true,"is_view":false,"generic_type_params":[],"params":[],"return":[]},{"name":"transfer","visibility":"public","is_entry":true,"is_view":false,"generic_type_params":[],"params":["&signer","0x1::object::Object<0x4::token::Token>","address"],"return":[]},{"name":"upvote_product","visibility":"public","is_entry":true,"is_view":false,"generic_type_params":[],"params":["&signer","0x1::string::String"],"return":[]}],"structs":[{"name":"CollectionMutatorStore","is_native":false,"is_event":false,"abilities":["key"],"generic_type_params":[],"fields":[{"name":"mutator_ref","type":"0x4::collection::MutatorRef"},{"name":"collection_name","type":"0x1::string::String"}]},{"name":"MintTracker","is_native":false,"is_event":false,"abilities":["key"],"generic_type_params":[],"fields":[{"name":"total_minted","type":"u64"},{"name":"last_random_id","type":"u64"}]},{"name":"NewProductEvent","is_native":false,"is_event":true,"abilities":["drop","store"],"generic_type_params":[],"fields":[{"name":"token_name","type":"0x1::string::String"},{"name":"creator_addr","type":"address"}]},{"name":"ObjectController","is_native":false,"is_event":false,"abilities":["key"],"generic_type_params":[],"fields":[{"name":"app_extend_ref","type":"0x1::object::ExtendRef"}]},{"name":"TokenMutatorStore","is_native":false,"is_event":false,"abilities":["key"],"generic_type_params":[],"fields":[{"name":"mutator_ref","type":"0x4::token::MutatorRef"},{"name":"property_mutator_ref","type":"0x4::property_map::MutatorRef"},{"name":"token_name","type":"0x1::string::String"},{"name":"long_description","type":"0x1::string::String"},{"name":"social_url","type":"0x1::string::String"},{"name":"value","type":"u64"}]},{"name":"UpvoteUpdate","is_native":false,"is_event":true,"abilities":["drop","store"],"generic_type_params":[],"fields":[{"name":"upvoter","type":"address"},{"name":"product_name","type":"0x1::string::String"},{"name":"timestamp","type":"u64"},{"name":"product_addr","type":"address"},{"name":"new_upvotes","type":"u64"}]}]} as const;