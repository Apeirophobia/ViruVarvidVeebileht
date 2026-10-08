import express, { type Request, type Response, type NextFunction} from "express"

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000

const services = [
    {
        id: 1,
        name: "coloring",
        price: 50,
        description: "coloring of spare metal parts"
    },

    {
        id: 2,
        name: "aedhaedhahdha",
        price: 14,
        description: "coloring of spare metal parts"
    }
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

app.delete("/services/:id", (req: Request, res: Response) => {
    if (!req.params.id) { //Could never happen, but just in case
        res.status(400).send({error: "Service id is required"});
        return;
    }
    const serviceId = req.params.id ? typeof req.params.id === "string" ? parseInt(req.params.id) : parseInt(req.params.id[0]!) : null;
    const result = services.filter(service => service.id === serviceId)[0];

     if (typeof result[0] === undefined){ 
        return res.status(404).send({ error: "Widget not found" })
    }
    
    services.splice(result[0]-1,1)
    res.status(204).send()
    
});
app.listen(PORT, () => {
    console.log(`Server is launched on http://localhost:${PORT}/`);
})