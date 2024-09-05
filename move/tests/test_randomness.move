// #[test_only]
// module aptos_friend_addr::test_simple_aptogotchi {
//     use std::signer;
//     use aptos_framework::account;
//     use aptos_framework::randomness;
//     use aptos_friend_addr::simple_aptogotchi;

//     #[test(aptos_framework = @aptos_framework, user = @0x123)]
//     fun test_create_aptogotchi(aptos_framework: &signer, user: &signer) {
//         // ================================= Setup ==================================
//         let user_addr = signer::address_of(user);
//         account::create_account_for_test(user_addr);
//         randomness::initialize_for_testing(aptos_framework);

//         // ================================= Create Aptogotchi ==================================
//         simple_aptogotchi::create_aptogotchi(user);

//         // ================================= Verify Aptogotchi ==================================
//         let (body, ear, face) = simple_aptogotchi::get_aptogotchi(user_addr);

//         assert!(body <= simple_aptogotchi::get_body_max(), 1);
//         assert!(ear <= simple_aptogotchi::get_ear_max(), 2);
//         assert!(face <= simple_aptogotchi::get_face_max(), 3);
//     }

//     #[test(aptos_framework = @aptos_framework, user1 = @0x123, user2 = @0x456)]
//     fun test_multiple_aptogotchis(
//         aptos_framework: &signer, user1: &signer, user2: &signer
//     ) {
//         // ================================= Setup ==================================
//         let user1_addr = signer::address_of(user1);
//         let user2_addr = signer::address_of(user2);
//         account::create_account_for_test(user1_addr);
//         account::create_account_for_test(user2_addr);
//         randomness::initialize_for_testing(aptos_framework);

//         // ================================= Create Aptogotchis ==================================
//         simple_aptogotchi::create_aptogotchi(user1);
//         simple_aptogotchi::create_aptogotchi(user2);

//         // ================================= Verify Aptogotchis ==================================
//         let (body1, ear1, face1) = simple_aptogotchi::get_aptogotchi(user1_addr);
//         let (body2, ear2, face2) = simple_aptogotchi::get_aptogotchi(user2_addr);

//         assert!(
//             body1 <= simple_aptogotchi::get_body_max() && body2 <= simple_aptogotchi::get_body_max(),
//             4,
//         );
//         assert!(
//             ear1 <= simple_aptogotchi::get_ear_max() && ear2 <= simple_aptogotchi::get_ear_max(),
//             5,
//         );
//         assert!(
//             face1 <= simple_aptogotchi::get_face_max() && face2 <= simple_aptogotchi::get_face_max(),
//             6,
//         );

//         // Verify that at least one attribute is different (highly likely due to randomness)
//         assert!(
//             body1 != body2 || ear1 != ear2 || face1 != face2,
//             7,
//         );
//     }

//     #[test(user = @0x123)]
//     #[expected_failure(abort_code = 0x50001)]
//     fun test_get_nonexistent_aptogotchi(user: &signer) {
//         let user_addr = signer::address_of(user);
//         account::create_account_for_test(user_addr);

//         // This should fail because no Aptogotchi has been created for this user
//         simple_aptogotchi::get_aptogotchi(user_addr);
//     }
// }
