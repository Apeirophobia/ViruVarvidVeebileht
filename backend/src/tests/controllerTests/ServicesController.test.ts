import { describe, it, expect, vi, test, beforeEach } from 'vitest';  

import type { Request, Response } from 'express';
import {v7 as uuidv7} from 'uuid';

//mock db
const mocks = vi.hoisted(() => ({
    findAll: vi.fn(),
    FindByPk: vi.fn(),
}))

vi.mock("../../db.ts", () => ({
    db: {
        services: {
            findAll: mocks.findAll,
            findByPk: mocks.FindByPk,
        }
    }
}))

import _ServicesController from "../../controllers/ServicesController.ts";

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
})