import express, { type Request, type Response, type NextFunction} from "express"

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000

app.get("/", (req: Request, res: Response) => {
    res.send("works. yes works")
});

app.listen(PORT, () => {
    console.log(`Server is launched on http://localhost:${PORT}/`);
})