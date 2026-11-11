import { describe, it, expect, vi, test, beforeEach } from 'vitest';  

import type { Request, Response } from 'express';
import {v7 as uuidv7} from 'uuid';

//mock db
const mocks = vi.hoisted(() => ({
    findAll: vi.fn(),
    FindByPk: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn()
}))

vi.mock("../../db.ts", () => ({
    db: {
        services: {
            findAll: mocks.findAll,
            findByPk: mocks.FindByPk,
            create: mocks.create,
            update: mocks.update,
            destroy: mocks.destroy,
        }
    }
}))

import _ServicesController from "../../controllers/ServicesController.ts";
import type { Service } from "../../models/service.ts";

describe("ServicesController", () => {
    beforeEach(() => {
        vi.clearAllMocks
    })

    test("Return_AllServices_With200Status", async () =>{
        //ülesseade
        mocks.findAll.mockResolvedValueOnce(
            [
                {ServiceID: "01a1c9d8-f99a-71c9-8964-4d9f888119dc",
                ServiceName: "vi-service-test1"},
                {ServiceID: "01a1c9d9-2216-713d-ae64-ff1a3cf64e6e",
                ServiceName: "vi-service-test2"},
                {ServiceID: "01a1c9d9-501e-7679-836a-fb21ed49fcf9",
                ServiceName: "vi-service-test3"}
            ]
        )
        const req = {} as Request
        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis(),
        } as unknown as Response

        //tegevus
        await _ServicesController.getAll(req, res)

        //kontroll
        expect(mocks.findAll).toHaveBeenCalledOnce();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith([
                {ServiceID: "01a1c9d8-f99a-71c9-8964-4d9f888119dc",
                ServiceName: "vi-service-test1"},
                {ServiceID: "01a1c9d9-2216-713d-ae64-ff1a3cf64e6e",
                ServiceName: "vi-service-test2"},
                {ServiceID: "01a1c9d9-501e-7679-836a-fb21ed49fcf9",
                ServiceName: "vi-service-test3"}
        ])
    })

    test("Return_OneServiceByID_With200Status", async () =>{
        const service = 
        {
            ServiceID: "01a1c9d8-f99a-71c9-8964-4d9f888119dc",
            ServiceName: "vi-service-test1",
            Description: "vi-service-testdescription1",
            Category: "Korova",
            Price: 100,
            createdAt: new Date(),
            updatedAt: new Date()
        }   
        const req = {
            params: {
                id: service.ServiceID
            }
        } as unknown as Request
        
        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis(),
        } as unknown as Response
        mocks.FindByPk.mockResolvedValue(service)

        await _ServicesController.getByID(req, res)

        expect(mocks.FindByPk).toHaveBeenCalledExactlyOnceWith(service.ServiceID)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(service)
    })

    test("Created_Service_With201Status", async () => {

        mocks.create.mockResolvedValue({
            id: "01a1ca2e-ecd4-73ed-a4c8-3b907ed349e8"
        });
        const id = "01a1ca2e-ecd4-73ed-a4c8-3b907ed349e8"


        const req = {
            protocol: "http",
            get: vi.fn(() => "localhost:8080"),
            body: {
                ServiceName: "Lehma pesemine",
                Price: 100,
                Category: "Loomad",
                Description: "Peseme teie lehma puhtaks"
            }
        } as unknown as Request

        
        const res = {
            location: vi.fn().mockReturnThis(),
            sendStatus: vi.fn().mockReturnThis()
        } as unknown as Response

        
        // tegevus
        await _ServicesController.create(req, res);

        console.log("THIS IS IT: ", res["location"]);
        // checks
        expect(mocks.create).toHaveBeenCalledOnce()
        expect(res["location"]).toHaveBeenCalledWith(`http://localhost:8080/services/${id}`)
        expect(res.sendStatus).toHaveBeenCalledWith(201)
        

    })

    test("Return_ModifiedGameById_With201Status", async() => {
        mocks.FindByPk.mockResolvedValue({ id: "01a18e66-5fdb-73f6-9f36-fec1238c7d30"});

        const service = 
        {
            id: "01a18e66-5fdb-73f6-9f36-fec1238c7d30",
            ServiceName: "Lehm",
            Price: 100,
            Category: "Loomad",
            Description: "Peseme teie lehma"
        }
        mocks.update.mockResolvedValue([1]);
    })


    test("Return_NoContentOnDelete_With204Status", async() => {
        const destroy = vi.fn();
        const thisid = "01a18e66-5fdb-73f6-9f36-fec1238c7d30" 
        mocks.FindByPk.mockResolvedValue({ 
            id: thisid
        });

        const req = {
            params: {
                id: "01a18e66-5fdb-73f6-9f36-fec1238c7d30"
            }
        } as unknown as Request

        const res = {
            status: vi.fn().mockReturnThis(),
            send: vi.fn().mockReturnThis()
        } as unknown as Response

        await _ServicesController.deleteByID(req, res);
        

        expect(mocks.FindByPk).toHaveBeenCalledWith(thisid);
        expect(destroy).toHaveBeenCalledOnce();
        expect(res.status).toHaveBeenCalledWith(204);





    })
})