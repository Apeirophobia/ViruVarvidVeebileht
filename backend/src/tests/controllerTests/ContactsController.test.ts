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
    });

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

    });

    test("Return_CreatedContact_With201Status", async () => {
        const id = "0386cf61-3b95-4e2c-b7d8-662b3b9ba338"; // UUID

        mocks.create.mockResolvedValue({ ContactID: id}); // Kirjeldame, mis tulemust peab create() tagastama

        const req = { 
            protocol: "http", // Määrame protokolliks HTTP
            get: vi.fn(() => "localhost:8080"), // Get funktsiooni vastuseks
            body: { // Päringu keha: vajalikud andmeväljad
                Name: "vi-contact-test4", // Nimi
                Description: "lehm", // Kirejldus
                Email: "internetemittingcow@gmail.com", // Email
                PhoneNumber: "+372 76 79481" // Telefoninumber
            }
        } as unknown as Request // Loome HTTP päringu

        const res = { 
            location: vi.fn().mockReturnThis(), // muutumisel mock jälgib location attribuuti
            sendStatus: vi.fn().mockReturnThis() // muutumisel mock jälgib sendStatus attribuuti
        } as unknown as Response // Loome HTTP vastuse


        // action
        await _ContactsController.create(req, res); // kutsume Create meetodi contactsControlleris

        expect(mocks.create).toHaveBeenCalledOnce(); // Kontrollime kas .create() on kutsuti välja
        expect(res.location).toHaveBeenCalledWith(`http://localhost:8080/contacts/${id}`); // Kontrollime kas res.location vastab antud parameetrile
        expect(res.sendStatus).toHaveBeenCalledWith(201); // Kontrollime kas res.sendStatus on 201
    });

    test("Return_ModifiedByID_With201Status", async () => {
        
        mocks.findByPk.mockResolvedValue({ ContactID: "01a18e66-5fdb-73f6-9f36-fec1238c7d30"}) // mockime findByPk vastuse
        
        const contact = // loome mock tabeli
        {
            ContactID: "01a18e66-5fdb-73f6-9f36-fec1238c7d30", // no need to explain ig
            Name:"vi-contacts-test1",
            Email: "cow@gmail.com",
            Description: "Hobune", 
            PhoneNumber: "+123 2222 4444",
        }

        mocks.update.mockResolvedValue([1]); 
        
        const req = {
            protocol: "http", // Määrame protokolliks HTTP
            get: vi.fn(() => "localhost:8080"), // Get funktsiooni vastuseks
            params: { // Päringu parameetrid: vajalik id
                id: "01a18e66-5fdb-73f6-9f36-fec1238c7d30"
            },
            body: { // Päringu keha: vajalikud andmeväljad
                Name: "Interneti Kiirgav Lehm", // Nimi
                Description: "lehm", // Kirjeldus
                Email: "internetemittingcow@gmail.com", // Email
                PhoneNumber: "+372 76 79481" // TelefoniNumber
            }
        } as unknown as Request; // Loome HTTP päringu

        const res = {
            location: vi.fn().mockReturnThis(), // muutumisel mock jälgib location attribuuti
            status: vi.fn().mockReturnThis(), // muutumisel mock jälgib sendStatus attribuuti
            send: vi.fn().mockReturnThis() // muutumisel mock jälgib send attribuuti
        } as unknown as Response // Loome HTTP vastuse

        // action
        const result = await _ContactsController.modifyByID(req, res) as unknown as Contact // ootame vastust (andmetabeli) päris kontrollerist

        // checks
        expect(mocks.findByPk).toHaveBeenCalledWith(contact.ContactID); // kontrollime kas findByPk oli kutsutud antud parameetriga
        expect(mocks.update).toHaveBeenCalledOnce(); // konrtollime, et update kutsuti välja üks kord

        const updatedContact = mocks.update.mock.calls[0][0]; // saame uuendatud andmetabeli mock'i hoiusest

        console.log("updatedContact: ", updatedContact); 

        expect(updatedContact.Name).toBe(req.body.Name); // kontrollime kas lõppandmed vastavad meie päringule
        expect(updatedContact.Email).toBe(req.body.Email); // kontrollime kas lõppandmed vastavad meie päringule
        expect(updatedContact.Description).toBe(req.body.Description); // kontrollime kas lõppandmed vastavad meie päringule
        expect(updatedContact.PhoneNumber).toBe(req.body.PhoneNumber); // kontrollime kas lõppandmed vastavad meie päringule

        expect(mocks.update.mock.calls[0][1]).toEqual({
            where: {
                ContactID: contact.ContactID
            }
        }) // kontrollime kas lõpp-andmetabeli ID, on sama mis algse
        expect(res.status).toHaveBeenCalledWith(201); // res status peab olema 201
    
    });

    test("Return_NoContentOnDelete__With204Status", async () => { 
        const thisid = "01a18e66-5fdb-73f6-9f36-fec1238c7d30"; // peamine iD

        const contact = { // dummy andmed
            ContactID: thisid, // id
            destroy: vi.fn().mockResolvedValue(undefined) // määrame destroy vastust
        }

        mocks.findByPk.mockResolvedValue(contact); // möäärame findByPk vastust

        const req = { 
            params: { // Määrame päringu keha
                id: thisid // id
            }
        } as unknown as Request // Loome päringu

        const res = {
            status: vi.fn().mockReturnThis(), // jälgime status
            send: vi.fn().mockReturnThis(), // jälgime send
            //sendStatus: vi.fn().mockReturnThis(),
        } as unknown as Response // Loome vastuse

        await _ContactsController.deleteByID(req, res); // kustume kontrolleri, et ei laiskleks

        expect(mocks.findByPk).toHaveBeenCalledWith(thisid); // kontrollime kas findByPk 
        expect(contact.destroy).toHaveBeenCalledOnce();
        expect(res.status).toHaveBeenCalledWith(204);
    });

    // Kolm loooooooooomingulist

    test("Return_NotFoundOnDelete__With404Status", async () => {
        const thisid = "01a18e66-5fdb-73f6-9f36-fec1238c7d30";

        const contact = {
            ContactID: thisid,
            destroy: vi.fn().mockResolvedValue(undefined)
        }

        mocks.findByPk.mockResolvedValue(undefined);

        const req = {
            params: {
                id: "param param pam :D"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis(),
            //sendStatus: vi.fn().mockReturnThis(),
        } as unknown as Response

        await _ContactsController.deleteByID(req, res);

        expect(mocks.findByPk).toHaveBeenCalledWith("param param pam :D");
        expect(res.status).toHaveBeenCalledWith(404);
    });

    test("Return_MissingParametersOnCreate_With400Status", async () => {
        const id = "0386cf61-3b95-4e2c-b7d8-662b3b9ba338"; // UUID

        mocks.create.mockResolvedValue({ ContactID: id}); // Kirjeldame, mis tulemust peab create() tagastama

        const req = {
            protocol: "http",
            get: vi.fn(() => "localhost:8080"),
            body: {
                Name: "vi-contact-test4",
                Description: "lehm",
                PhoneNumber: "+372 76 79481"
            }
        } as unknown as Request

        const res = {
            location: vi.fn().mockReturnThis(),
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response


        // action
        await _ContactsController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    })

    test("Return_NotFoundOnGetByID_With404Status", async() => {
        const contact = // loome mock tabeli
        {
            ContactID: "01a18e66-5fdb-73f6-9f36-fec1238c7d30",
            Name:"vi-contacts-test1",
            Email: "cow@gmail.com",
            PhoneNumber: "+123 2222 4444",
        }

        const req = {
            params: { // Päringu parameetrid 
                id: "moo" 
            }
        } as unknown as Request // Loome päringu

        const res = {
            // käsime vi (virutaliseerijale) jäligda järgmiseid parameetre
            status: vi.fn().mockReturnThis(), // res muutumisel jälgib mock status atribuuti
            send: vi.fn().mockReturnThis() // res muutumisel jälgib mock send atribuuti
        } as unknown as Response // loome vastuse

        // mockResolvedValueOnce kirjeldab, mis tulemust peab findByPk() tagastama (undefined)
        mocks.findByPk.mockResolvedValue(undefined);

        // action
        await _ContactsController.getByID(req, res); // kutsume välja konrtolleri enne loodud päringu ja vastusega
        
        // checks
        expect(mocks.findByPk).toHaveBeenCalledExactlyOnceWith("moo"); // Kontrollib: kas db.tabeli_nimi.findAll() oli kutsutud välja AINULT ÜKS kord 
        // ja parameertriga contact.ContactID!
        expect(res.status).toHaveBeenCalledWith(404); // Kontrollib: kas vastuse staatus on 404, (kontrolleris vastuse muutmisel jälgis mock neid andmeid)

        // Siia tuleb eesti keelne kokkuv6tte 
    })

})


/*


⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠤⠴⢤⡶⠓⢐⣲⠤⠤⠤⠤⢄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠎⠀⠀⠀⢀⠞⠁⠀⠀⠀⠀⠀⠀⠈⢣⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⣀⣀⠀⠀⠀⠀
⣠⣶⣾⣿⣿⣿⣿⣿⣿⣿⣷⣶⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣤⡤⠿⠀⠀⠀⠤⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠒⠒⠒⠒⣤⣤⣤⣴⣁⣀⡗⠖⠚⠉⢕⠀⠀⠀⠀⢀⣠⣤⣴⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣄⡀⠀⠀⠀⠀⠀⠀⢠⣾⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⡈⡇⠀⢠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⠀
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣦⠀⠙⠛⢙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀
⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⡴⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣽⣿⣿⣿⣿⣿⣿⣿⣿⣷⣀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀
⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠻⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⠄⣰⣿⣿⣿⣿⣿⠿⣿⡟⢃⣹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀
⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⡟⠛⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⣾⣿⣿⣿⣿⣿⣿⣿⡁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣷⣿⣦⣼⣍⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠀
⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠹⢿⣿⣿⣿⣿⣿⡇⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀
⠀⠀⠀⠀⠙⠻⣿⣿⣿⠟⠁⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠻⢿⣿⣷⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠏⠉⢙⣻⠟⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠘⣿⣿⣄⠀⠀⠀⠀⠀⠀⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⡠⢀⡀⠀⠄⠀⠀⠀⠠⡀⠀⠀⠀⠀⡀⠀⢀⣀⠀⠀⢀⠠⠀⠀⠉⠛⢿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠙⠿⠟⠻⠿⠁⠴⢀⣤⠚⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⡽⣽⣷⠿⣶⣶⣶⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⢁⡠⠔⠚⠀⠀⠄⠀⠈⠀⠂⠀⠀⢠⠀⠀⠀⠈⠀⠉⠀⠈⠒⠒⡦⠀⠀⠁⠲⢠⠀⠻⣦⣼⣿⣿⣿⣿⣀⣀⣀⣠⡤⠶⠒⠒⠊⡟⠚⠣⢀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠈⠀⢸⠉⠉⠉⠉⠉⠙⠻⢿⣿⣿⣿⣿⣿⢋⢼⣭⠀⠀⠀⠀⠂⠀⠀⠀⠀⠀⠰⡀⠀⠀⠠⠀⣂⣀⠀⠀⠀⠀⠐⢀⠄⠀⣴⡀⢀⠌⠀⠘⡏⠀⠀⠀⠉⠉⠉⠉⠀⠀⠀⢀⡤⠚⠁⠀⠀⠈⠳⠤⡄⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠑⠒⠒⠒⠒⠐⠚⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⢛⡏⢸⠘⣤⢀⣿⣗⣀⠁⠈⠀⠀⠂⠐⠉⠀⠄⠘⠀⠈⣀⠀⠀⠐⠂⠐⠉⢡⣤⠾⢉⣠⡞⠀⠀⠀⠘⡀⠀⠀⠀⠀⢀⣀⡀⢀⠖⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣀⠤⠒⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⡅⠌⠈⡎⢳⢹⡿⠝⣷⡀⠀⡀⠀⠀⡀⠀⠀⠁⣤⡀⠁⠐⡀⠀⠀⠀⢹⣿⠯⠔⡿⠀⢀⠀⢀⡀⠀⢱⠀⠀⠀⠀⢸⠀⠙⢮⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⡀⢀⠤⠊⠁⢠⠜⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢞⠃⡆⠀⣁⠀⣎⣿⡀⢹⣷⠀⠀⠉⠱⠂⠀⠀⣄⣼⣿⣿⣇⡉⣀⠰⡀⣾⣿⠀⢀⡇⠀⠀⠀⠀⠀⢄⠀⢦⠀⠀⠀⢸⠀⠶⡎⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠈⠉⡀⠤⠀⡀⠉⠑⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠎⡌⠰⡅⢀⣿⠟⠁⢹⣷⣸⣿⠠⠈⣁⣃⡈⡄⠀⢽⣿⣿⡿⢋⠀⣉⡒⠠⠀⠨⠰⢼⠃⠀⠀⠀⢀⠔⠀⢀⠀⢳⠐⠢⠤⢿⡔⠳⢄⣀⣀⠀⠀⠀⡄⢒⣠⠄⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠰⠈⠂⠀⠀⠓⠉⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀⢇⠀⣅⠗⣃⣿⣿⣀⣀⣀⣿⡿⠁⠀⠂⠥⢘⣹⣿⣦⣸⡈⢁⣄⣿⣿⣾⡷⠀⠆⠀⠀⠀⠉⠙⠒⠒⠂⢂⠄⠀⠑⠨⠷⡀⠀⠀⠘⠦⡀⠀⠀⠉⠉⡯⣤⠊⠉⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠒⠀⠀⠀⠠⠀⠀⠐⠐⠮⠠⠔⠒⢄⠀⠀⠀⠀⠀⠈⣶⠃⠈⢻⣿⣾⡽⢿⡿⢟⠀⠀⠰⠢⢄⠈⢿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀⡀⠀⠁⠐⠄⠀⠀⠀⠔⠀⠀⠀⠀⠘⡀⢱⣀⣀⡀⢀⣘⡆⠀⠀⠀⠑⣇⡄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠠⡀⠀⠄⠨⡑⠤⡀⠀⠰⠋⠁⠈⣹⣯⣼⡇⢽⣟⠀⠀⢀⡀⠀⡀⠁⠀⠈⠁⠀⠼⢿⣿⡿⠋⠀⠀⢀⠈⠀⠀⠀⠀⠨⠁⢀⠀⠀⠀⠀⠐⠀⠀⠂⢃⠀⠈⠉⠁⠀⠀⠀⠀⠀⣉⠙⠦⣀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠐⠀⠄⣀⠀⠉⠐⠒⠂⠀⠈⠀⠀⠖⠁⠀⡇⠀⠠⠐⣙⣿⣏⣻⢄⡈⠀⠀⡀⠠⠐⠄⠰⢄⡁⠀⠰⠀⠚⡙⠀⠀⠀⣄⠀⠤⠀⢀⠐⢀⠅⢀⠠⡀⠀⠀⠀⠠⠀⠠⠁⢸⡄⠀⠀⡤⠒⠒⠤⠊⠹⠀⠀⠉⠉⠈⠀⠐
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠨⢀⠄⠁⠀⡀⠍⡀⠀⠀⠀⢡⠀⡀⢀⢴⣯⣠⣾⣯⡏⢁⠘⠂⠄⠀⠀⡑⠢⡁⠊⠆⠀⠈⠁⠀⠁⠀⠤⠠⠀⠶⢈⠀⠈⡇⢇⠳⣄⢀⠀⠈⠀⠀⠀⢣⢴⠇⠀⠀⢧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠤⠔⠁⠈⠀⠀⠈⠀⠀⢈⠀⢀⡀⠘⠀⠕⢝⡟⡱⣿⣿⣿⣿⣀⡀⢅⢀⠢⠄⠀⠀⠁⠀⠈⠁⠳⡀⠁⣐⠁⠀⠀⢉⠒⢄⢈⡀⢼⡟⠿⣵⠀⠠⡀⠀⡀⠀⠀⡘⠣⠤⠜⠉⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠤⠔⠈⠂⠤⢅⠀⠀⠀⠀⡠⢀⠔⠁⠀⠸⣀⡱⡀⠀⣤⣴⣿⢎⠵⡛⢃⣷⣿⣯⢟⠬⡄⢁⢢⣀⣆⣮⣷⡷⠾⠷⠾⠷⡶⣷⢾⣶⣶⡾⠶⢿⣾⣿⣅⣽⢀⣧⣄⢱⣢⣮⠐⠄⡧⠒⠒⠒⢦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠔⠑⠀⠈⠈⠀⠁⠀⠀⠀⠀⢀⠀⠈⠁⢸⣿⣿⣼⣴⣷⣿⣿⣯⣿⡿⠟⠛⠉⠋⠟⢋⣁⣀⣀⡀⣀⡀⠀⡀⢮⢊⠠⢀⡀⢄⡀⣠⣴⠋⣻⣿⡿⡙⢿⡋⠁⢀⡸⠁⠀⠀⠀⠀⠣⠄⠀⠤⠔⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⠀⠁⠀⠀⠀⣽⣡⠻⣿⣿⣿⣿⡟⠫⣀⡦⡄⣀⠄⣀⠆⠹⣶⣿⡷⣿⣿⣻⣇⢨⢿⣦⣡⡷⣏⠚⠤⣵⡆⢫⠛⠣⡱⣎⡙⢾⡍⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠀⠀⠀⠀⠀⣿⣿⣾⣷⡉⡰⣜⠉⢠⡉⣷⣿⢿⡾⢟⣽⣳⣿⣾⣿⣿⣽⢿⡯⣿⡜⣷⢹⣽⣮⡛⠃⠋⢠⡮⠀⠁⠑⣧⠹⣌⢻⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⠒⠀⣰⣿⣷⣿⣿⣿⡇⣿⣸⢇⠙⠻⢿⠿⢷⡟⣯⡝⢻⠛⡟⣉⣿⣬⠃⣾⢹⠉⠈⠁⠃⠀⠀⠠⠊⣀⠘⡇⢁⡏⣻⢷⡰⣜⢣⡠⠄⠲⢆⠀⠀⠂⠂⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣿⣻⣿⣿⢾⡟⢐⣟⣷⣿⡃⠀⠁⢠⣻⡅⢹⣧⣎⣇⢷⣿⠿⣿⢵⣽⢸⣤⣀⡄⠀⠀⢀⣀⣇⢈⣷⣾⠈⢰⠘⣧⢙⣿⡆⡱⣄⠀⠈⠱⠄⠀⠢⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣰⣿⣿⣿⣟⣫⣼⢣⣟⣽⢟⣿⣶⣖⣰⣾⢻⣃⣾⡇⣽⣿⣾⣿⣾⣿⣿⡏⣻⢹⣿⣿⣿⢘⣟⣿⣿⣿⣿⣿⣷⡏⠀⡁⠀⠯⡙⢮⣿⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀




*/