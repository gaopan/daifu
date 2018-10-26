const { mysql: dbConfig, filesPath: filePath } = require('../config')
const send = require('koa-send')
const fs = require('fs')

const imgPath = filePath + "/imgs"

const DB = require('knex')({
    client: 'mysql',
    connection: {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.pass,
        database: dbConfig.db,
        charset: dbConfig.char,
        multipleStatements: true
    }
})

async function cats(ctx, next) {
    ctx.body = await new Promise((res, rej) => {
        DB.select().table('anatomyCat').then(function(cats) {
            let _cats = [],
                _childCats = [];
            cats.forEach(cat => {
                if (!cat.parentId) {
                    cat.children = [];
                    _cats.push(cat);
                } else {
                    _childCats.push(cat);
                }
            });
            _childCats.forEach(cat => {
                cats.every(pCat => {
                    if (pCat.id == cat.parentId) {
                        pCat.children.push(cat);
                        return false;
                    }
                    return true;
                });
            });
            _cats.forEach(cat => {
                cat.isHaveChild = cat.children.length > 0;
            });
            res(_cats);
        });
    });
}

async function cat(ctx, next) {
    let cat = await new Promise((res, rej) => {
        DB.select().table('anatomyCat').where("id", ctx.params.id).then(function(cats) {
            res(cats && cats.length > 0 ? cats[0] : null);
        })
    });
    if (!cat) {
        ctx.status = 404;
        ctx.body = "Not found."
    } else {
        cat.sides = await new Promise((res, rej) => {
            DB.select().table('anatomySide').where("catId", ctx.params.id).then(function(sides) {
                console.log(sides)
                res(sides);
            })
        })

        ctx.body = cat
    }
}

async function side(ctx, next) {
    let side = await new Promise((res, rej) => {
        DB.select().table('anatomySide').where("id", ctx.params.id).then(function(sides) {
            res(sides && sides.length > 0 ? sides[0] : null);
        })
    })
    if (!side) {
        ctx.status = 404;
        ctx.body = "Not found."
    } else {
        side.parts = await new Promise((res, rej) => {
            DB.select().table("anatomyPart").where("sideId", ctx.params.id).then(function(parts) {
                res(parts)
            })
        })
        side.img = await new Promise((res, rej) => {
            DB.select().table("anatomyImg").where("id", side.imgId).then(imgs => {
                res(imgs && imgs.length > 0 ? imgs[0] : null)
            })
        })
        ctx.body = side
    }
}

async function img(ctx, next) {
    let imageName = await new Promise((res, rej) => {
        DB.select("name").table("anatomyImg").where("id", ctx.params.id).first().then(img => {
            res(img.name);
        })
    })
    await send(ctx, imageName, {
        root: imgPath,
        immutable: true,
        maxage: 1000 * 60 * 60 * 24
    })
}

module.exports = {
    cats,
    cat,
    side,
    img
}