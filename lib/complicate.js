var less    = require("less")
var jade    = require("jade")
var fs      = require("fs")
var path    = require("path")


function main(cmd) {
    if(cmd == 'init')
        init() 
    else if(cmd == 'watch')
        watch()
    else
        console.log("invalid command...")
}

function replaceExt(filename, newext) {
    return filename.substr(0, filename.length - path.extname(filename).length) + newext
}

function compileLess() {
    var files = fs.readdirSync("./src")
    try
    {

        for (i in files) {
            var f = files[i]
            if(path.extname(f) == ".less") {
                less.render(
                    fs.readFileSync("./src/" + f, {encoding: 'utf8'}),
                    {paths: ["./src"], filename: f},
                    function(e, css) {
                        fs.writeFileSync("./app/" + replaceExt(f, ".css"), css)
                    }
                )
            }
        }

    }
    catch(err)
    {
        console.log(err)
    }
}

function compileJade() {
    var files = fs.readdirSync("./src")
    try
    {

        for (i in files) {
            var f = files[i]
            if(path.extname(f) == ".jade") {
                var html = jade.compile(
                    fs.readFileSync("./src/" + f, {encoding: 'utf8'}),
                    {filename: f})({})
                fs.writeFileSync("./app/" + replaceExt(f, ".html"), html)
            }
        }

    }
    catch(err)
    {
        console.log(err)
    }
}

// init : create the files and directories to work in
function init() {
    if(!fs.existsSync("./src"))
        fs.mkdirSync("./src")
    if(!fs.existsSync("./app"))
        fs.mkdirSync("./app")
    if(!fs.existsSync("./src/index.jade"))
        fs.writeFileSync("./src/index.jade", "html\n    head\n        link (rel=\"stylesheet\", type=\"text\/css\", href=\"style.css\")\n    body");
    if(!fs.existsSync("./src/style.less"))
        fs.writeFileSync("./src/style.less", "// put your stuff here");
        compileLess();
        compileJade();
}

// watch : watch files and compile them
function watch() {
    compileLess()
    compileJade()
    fs.watch("./src", function(event, filename) {
        var exten = path.extname(filename)
        switch(exten) {
            case ".less":
                compileLess()
                break
            case ".jade":
                compileJade()
                break
        }
    })
}

main( process.argv[2] )

