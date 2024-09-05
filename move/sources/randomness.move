module aptos_friend_addr::simple_aptogotchi {
    use std::signer;
    use aptos_framework::randomness;
    use aptos_framework::event;
    use aptos_framework::account;

    struct Aptogotchi has key, store {
        body: u8,
        ear: u8,
        face: u8,
    }

    #[event]
    struct AptogotchiCreated has drop, store {
        owner: address,
        body: u8,
        ear: u8,
        face: u8,
    }

    #[event]
    struct AptogotchiUpdated has drop, store {
        owner: address,
        body: u8,
        ear: u8,
        face: u8,
    }

    const BODY_MAX: u8 = 5;
    const EAR_MAX: u8 = 6;
    const FACE_MAX: u8 = 4;

    const E_APTOGOTCHI_ALREADY_EXISTS: u64 = 1;

    #[randomness]
    entry fun create_aptogotchi(user: &signer) {
        let user_addr = signer::address_of(user);
        assert!(!exists<Aptogotchi>(user_addr), E_APTOGOTCHI_ALREADY_EXISTS);

        let body = randomness::u8_range(0, BODY_MAX);
        let ear = randomness::u8_range(0, EAR_MAX);
        let face = randomness::u8_range(0, FACE_MAX);

        let aptogotchi = Aptogotchi { body, ear, face };

        move_to(user, aptogotchi);

        event::emit(AptogotchiCreated { owner: user_addr, body, ear, face });
    }

    #[randomness]
    entry fun update_aptogotchi(user: &signer) acquires Aptogotchi {
        let user_addr = signer::address_of(user);
        assert!(exists<Aptogotchi>(user_addr), 0);

        let aptogotchi = borrow_global_mut<Aptogotchi>(user_addr);
        
        aptogotchi.body = randomness::u8_range(0, BODY_MAX);
        aptogotchi.ear = randomness::u8_range(0, EAR_MAX);
        aptogotchi.face = randomness::u8_range(0, FACE_MAX);

        event::emit(AptogotchiUpdated { 
            owner: user_addr, 
            body: aptogotchi.body, 
            ear: aptogotchi.ear, 
            face: aptogotchi.face 
        });
    }

    #[view]
    public fun get_aptogotchi(owner: address): (u8, u8, u8) acquires Aptogotchi {
        let aptogotchi = borrow_global<Aptogotchi>(owner);
        (aptogotchi.body, aptogotchi.ear, aptogotchi.face)
    }

    public fun get_body_max(): u8 { BODY_MAX }
    public fun get_ear_max(): u8 { EAR_MAX }
    public fun get_face_max(): u8 { FACE_MAX }

    #[test(fx = @aptos_framework, creator = @0x123)]
    fun test_create_and_update_aptogotchi(
        fx: &signer,
        creator: &signer
    ) acquires Aptogotchi {
        // Setup
        account::create_account_for_test(@aptos_framework);
        account::create_account_for_test(@0x123);
        
        // Create Aptogotchi
        create_aptogotchi(creator);
        
        // Verify Aptogotchi exists
        let (body, ear, face) = get_aptogotchi(@0x123);
        assert!(body <= BODY_MAX && ear <= EAR_MAX && face <= FACE_MAX, 0);
        
        // Update Aptogotchi
        update_aptogotchi(creator);
        
        // Verify Aptogotchi has been updated
        let (new_body, new_ear, new_face) = get_aptogotchi(@0x123);
        assert!(new_body <= BODY_MAX && new_ear <= EAR_MAX && new_face <= FACE_MAX, 0);
        assert!(new_body != body || new_ear != ear || new_face != face, 0);
    }
}