export const ABI = {"address":"0x9ee0057ac7c3d02887b24876a91e332817a9f23b84d0217fd8f033dd6ad71635","name":"product_nft","friends":[],"exposed_functions":[{"name":"create_collection","visibility":"public","is_entry":true,"is_view":false,"generic_type_params":[],"params":["&signer"],"return":[]},{"name":"get_product_obj","visibility":"public","is_entry":false,"is_view":true,"generic_type_params":[],"params":["address","0x1::string::String","0x1::string::String"],"return":["0x1::object::Object<0x4::token::Token>"]},{"name":"get_upvote_count","visibility":"public","is_entry":false,"is_view":true,"generic_type_params":[],"params":["0x1::object::Object<0x4::token::Token>"],"return":["u64"]},{"name":"mint_product","visibility":"public","is_entry":true,"is_view":false,"generic_type_params":[],"params":["&signer","0x1::string::String","0x1::string::String","0x1::string::String"],"return":[]},{"name":"modify_product_description","visibility":"public","is_entry":true,"is_view":false,"generic_type_params":[],"params":["&signer","0x1::object::Object<0x4::token::Token>","0x1::string::String"],"return":[]},{"name":"transfer","visibility":"public","is_entry":true,"is_view":false,"generic_type_params":[{"constraints":["key"]}],"params":["&signer","0x1::object::Object<T0>","address"],"return":[]},{"name":"upvote_product","visibility":"public","is_entry":true,"is_view":false,"generic_type_params":[],"params":["&signer","0x1::object::Object<0x4::token::Token>","u64"],"return":[]}],"structs":[{"name":"CollectionMutatorStore","is_native":false,"abilities":["key"],"generic_type_params":[],"fields":[{"name":"mutator_ref","type":"0x4::collection::MutatorRef"}]},{"name":"TokenMutatorStore","is_native":false,"abilities":["key"],"generic_type_params":[],"fields":[{"name":"mutator_ref","type":"0x4::token::MutatorRef"},{"name":"property_mutator_ref","type":"0x4::property_map::MutatorRef"},{"name":"token_name","type":"0x1::string::String"}]},{"name":"UpvoteCount","is_native":false,"abilities":["key"],"generic_type_params":[],"fields":[{"name":"value","type":"u64"}]},{"name":"UpvoteUpdate","is_native":false,"abilities":["drop","store"],"generic_type_params":[],"fields":[{"name":"product","type":"address"},{"name":"old_upvotes","type":"u64"},{"name":"new_upvotes","type":"u64"}]}]} as const;