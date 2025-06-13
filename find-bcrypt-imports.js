const fs = require("fs")
const path = require("path")

function findBcryptImports(dir, results = []) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      findBcryptImports(filePath, results)
    } else if (stat.isFile() && (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".js"))) {
      const content = fs.readFileSync(filePath, "utf8")
      if (content.includes("from 'bcrypt'") || content.includes('from "bcrypt"')) {
        results.push(filePath)
      }
    }
  }

  return results
}

const bcryptImports = findBcryptImports(".")
console.log("Files importing bcrypt:")
bcryptImports.forEach((file) => console.log(file))
