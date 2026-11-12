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
