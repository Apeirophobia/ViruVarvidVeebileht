import express, { type Request, type Response, type NextFunction} from "express"

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000

let nextServiceId = 1;

const services: { id: number; name: string; price?: number | undefined; description: string }[] = [
    {
        id: nextServiceId++,
        name: "coloring",
        price: 50,
        description: "coloring of spare metal parts"
    },

    {
        id: nextServiceId++,
        name: "aedhaedhahdha",
        price: 14,
        description: "coloring of spare metal parts"
    },

];




app.get("/", (req: Request, res: Response) => {
    res.send("works. yes works")
});

app.get("/services", (req: Request, res: Response) => {
    let result: Array<object> = services.map((service) => ({
        id: service.id,
        name: service.name,
        price: service.price,
    }));

    // services.forEach((service) => {
    //     const newService = {
    //         id: service.id,
    //         name: service.name,
    //         price: service.price,

    //     }

    //     result.push(newService);
    // });

    res.send(result);
});

app.get("/services/:id", (req: Request, res: Response) => {
    if (!req.params.id) { //Could never happen, but just in case
        res.status(400).send({error: "Service id is required"});
        return;
    }
    const serviceId = req.params.id ? typeof req.params.id === "string" ? parseInt(req.params.id) : parseInt(req.params.id[0]!) : null;
    const result = services.filter(service => service.id === serviceId)[0];

    if (result === undefined) {
        res.status(404).send({error: "Service not found"});
        return;
    }

    res.send(result);
});

app.post("/games", (req: Request, res: Response) => {
    const name = req.body.name as string;
    const price = req.body.price ? parseFloat(req.body.price) : undefined;

    if(!name){
        res.status(400).send({error: "'name' is required"});
        return;
    }   

    if(Number.isNaN(price)){
        res.status(400).send({error: "'price' must be a number"});
        return;
    }

    const newService = {
        id: nextServiceId++,
        name: name,
        price: price,
    }

    services.push(newService);
    res.status(201).send(newService);
});

app.listen(PORT, () => {
    console.log(`Server is launched on http://localhost:${PORT}/`);
})