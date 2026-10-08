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
    let result: Array<object> = [];

    services.forEach((service) => {
        const newService = {
            id: service.id,
            name: service.name,
            price: service.price,

        }

        result.push(newService);
    });

    res.send(result);
});

app.listen(PORT, () => {
    console.log(`Server is launched on http://localhost:${PORT}/`);
})