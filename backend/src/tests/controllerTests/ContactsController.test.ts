import { describe, it, expect, vi, test, beforeEach } from 'vitest';

import type { Request, Response} from 'express';
import {v7 as uuidv7} from "uuid";

// Andmebaasi ORM funktsioonide mockimine (Sequelize p6hjal)
const mocks = vi.hoisted(() => ({
    findAll: vi.fn(), 
    findByPk: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn()
}))


// Andmebaasi mockimine, db -> tabeli_nimi -> vajalikud ORM meetodid
vi.mock("../../db.ts", () => ({
    db: {
        contacts: {
            findAll: mocks.findAll,
            findByPk: mocks.findByPk,
            create: mocks.create,
            update: mocks.update,
            destroy: mocks.destroy
        }
    }
}))

import _ContactsController from "../../controllers/ContactsController.ts"; // controller
import type { Contact } from "../../models/contacts.ts"; // ???


// Kontrolleri mockimine
describe("ContactsController", () => { 
    // BeforeEach() käivitab antud käske enne igat testi
    beforeEach(() => {
        vi.clearAllMocks() // Puhastab mocki andmeid (n.ö. clear cache)
    });

    test("Return_AllContacts_With200Status", async () => {
        // setup

        // mockResolvedValueOnce kirjeldab, mis tulemust peab findAll() tagastama
        mocks.findAll.mockResolvedValueOnce(
            [
                {ContactID: "01a18e66-5fdb-73f6-9f36-fec1238c7d30", Name:"vi-contact-test1"},
                {ContactID: "01a18e66-5fd8-76d4-a0d8-ac475e2d340c", Name:"vi-contact-test2"},
                {ContactID: "01a18e66-5fdb-73f6-9f37-033664a02b5a", Name:"vi-contact-test3"}
            ]
        )

        const req = {} as Request // loome Request e päringu
        const res = { 
            // käsime vi (virutaliseerijale) jäligda järgmiseid parameetre
            status: vi.fn().mockReturnThis(), // res muutumisel jälgib mock status atribuuti
            send: vi.fn().mockReturnThis() // res muutumisel jälgib mock send atribuuti
        } as unknown as Response; // loome Response e vastuse

        // action
        await _ContactsController.getAll(req, res); // kutsume välja konrtolleri enne loodud päringu ja vastusega

        // checks
        expect(mocks.findAll).toHaveBeenCalledOnce(); // Kontrollib: kas db.tabeli_nimi.findAll() oli kutsutud välja AINULT ÜKS kord
        expect(res.status).toHaveBeenCalledWith(200); // Kontrollib: kas vastuse staatus on 200, (kontrolleris vastuse muutmisel jälgis mock neid andmeid)
        expect(res.send).toHaveBeenCalledWith([ // Kontrollib: kas vastuse "saadetis" on antud objekt (kontrolleris vastuse muutmisel jälgis mock neid andmeid)
            {ContactID: "01a18e66-5fdb-73f6-9f36-fec1238c7d30", Name:"vi-contact-test1"},
            {ContactID: "01a18e66-5fd8-76d4-a0d8-ac475e2d340c", Name:"vi-contact-test2"},
            {ContactID: "01a18e66-5fdb-73f6-9f37-033664a02b5a", Name:"vi-contact-test3"}
        ]);

        // Siia tuleb eesti keelne kokkuv6tte
    })

    test("Return_OneContactById_With200Status", async() => {
        const contact = // loome mock tabeli
        {
            ContactID: "01a18e66-5fdb-73f6-9f36-fec1238c7d30",
            Name:"vi-contacts-test1",
            Email: "cow@gmail.com",
            PhoneNumber: "+123 2222 4444",
        }

        const req = {
            params: { // Päringu parameetrid 
                id: contact.ContactID 
            }
        } as unknown as Request // Loome päringu

        const res = {
            // käsime vi (virutaliseerijale) jäligda järgmiseid parameetre
            status: vi.fn().mockReturnThis(), // res muutumisel jälgib mock status atribuuti
            send: vi.fn().mockReturnThis() // res muutumisel jälgib mock send atribuuti
        } as unknown as Response // loome vastuse

        // mockResolvedValueOnce kirjeldab, mis tulemust peab findByPk() tagastama (enne loodud mock tabeli)
        mocks.findByPk.mockResolvedValue(contact);

        // action
        await _ContactsController.getByID(req, res); // kutsume välja konrtolleri enne loodud päringu ja vastusega
        
        // checks
        expect(mocks.findByPk).toHaveBeenCalledExactlyOnceWith(contact.ContactID); // Kontrollib: kas db.tabeli_nimi.findAll() oli kutsutud välja AINULT ÜKS kord 
        // ja parameertriga contact.ContactID!
        expect(res.status).toHaveBeenCalledWith(200); // Kontrollib: kas vastuse staatus on 200, (kontrolleris vastuse muutmisel jälgis mock neid andmeid)
        expect(res.send).toHaveBeenCalledWith(contact); // Kontrollib: kas vastuse "saadetis" on antud objekt (kontrolleris vastuse muutmisel jälgis mock neid andmeid)

        // Siia tuleb eesti keelne kokkuv6tte 
    })
})

