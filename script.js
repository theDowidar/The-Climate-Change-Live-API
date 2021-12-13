const PORT = process.env.PORT || 8000
const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")
const app = express()

const newspapers = [
    {
        name: "thenewyorktimes",
        address: "https://www.nytimes.com/international/section/climate",
        base: "https://www.nytimes.com"
    },
    {
        name: "thetimes",
        address: "https://www.thetimes.co.uk/environment/climate-change",
        base: ""
    },
    {
        name: "theguardian",
        address: "https://www.theguardian.com/environment/climate-crisis",
        base: ""
    },
    {
        name: "thetelegraph",
        address: "https://www.telegraph.co.uk/climate-change",
        base: "https://www.telegraph.co.uk"
    },
    {
        name: "",
        address: "",
        base: ""
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function() {
                const title = $(this).text()
                const url = $(this).attr("href")

                articles.push({
                    title,
                    url: newspaper.base + url,
                    sourse: newspaper.name
                })
            })

        })
})

app.get("/", (req, res) => {
    res.json("Welcome to my Climate Change News API")
})

app.get("/news", (req, res) => {
    res.json(articles)
})

app.get("/news/:newspaperID", (req, res) => {
    const newspaperID = req.params.newspaperID

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperID)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr("href")
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    sourse: newspaperID
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))    
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))