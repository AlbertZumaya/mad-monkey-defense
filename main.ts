namespace SpriteKind {
    export const Icon = SpriteKind.create()
    export const Tower = SpriteKind.create()
}
function makeATower (name: string, image2: Image, cost: number) {
    newTower = sprites.create(image2, SpriteKind.Tower)
    sprites.setDataString(newTower, "name", name)
    sprites.setDataNumber(newTower, "cost", cost)
    return newTower
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(thingWeAreHolding)) {
        if (PURPLE.overlapsWith(MONKEY)) {
            thingWeAreHolding = makeATower("MONKEY", assets.image`MONKEY2`, 1)
            PURPLE.setFlag(SpriteFlag.Invisible, true)
        }
    } else {
        thingWeAreHolding = [][0]
        PURPLE.setFlag(SpriteFlag.Invisible, false)
    }
})
spriteutils.createRenderable(5, function (screen2) {
    for (let value of sprites.allOfKind(SpriteKind.Tower)) {
        if (sprites.readDataString(value, "name") == "MONKEY") {
            spriteutils.drawCircle(
            screen2,
            value.x,
            value.y,
            archerRadius,
            7
            )
        }
    }
})
scene.onHitWall(SpriteKind.Enemy, function (sprite, location) {
    if (tiles.tileIs(tiles.locationOfSprite(sprite), assets.tile`myTile7`)) {
        sprite.vy = 0
        sprite.vx = enemySpeed
    } else if (tiles.tileIs(tiles.locationOfSprite(sprite), assets.tile`myTile4`)) {
        sprite.vy = enemySpeed
        sprite.vx = 0
    } else if (tiles.tileIs(tiles.locationOfSprite(sprite), assets.tile`myTile8`)) {
        sprite.vy = 0
        sprite.vx = 0 - enemySpeed
    } else if (tiles.tileIs(tiles.locationOfSprite(sprite), assets.tile`myTile9`)) {
        sprite.vy = 0 - enemySpeed
        sprite.vx = 0
    } else if (tiles.tileIs(tiles.locationOfSprite(sprite), assets.tile`myTile10`)) {
        sprite.vy = 0
        sprite.vx = enemySpeed
        if (Math.percentChance(50)) {
            sprite.vx = 0 - enemySpeed
        }
    } else if (tiles.tileIs(tiles.locationOfSprite(sprite), assets.tile`myTile2`)) {
        sprite.destroy()
        info.changeLifeBy(-1)
    } else {
    	
    }
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprite.destroy()
    sprites.changeDataNumberBy(otherSprite, "health", -1)
    if (sprites.readDataNumber(otherSprite, "health") <= 0) {
        otherSprite.destroy()
    }
})
let projectile: Sprite = null
let target: Sprite = null
let newEnemy: Sprite = null
let thingWeAreHolding: Sprite = null
let newTower: Sprite = null
let MONKEY: Sprite = null
let PURPLE: Sprite = null
let archerRadius = 0
let enemySpeed = 0
tiles.loadMap(tiles.createSmallMap(tilemap`level2`))
enemySpeed = 20
tiles.coverAllTiles(assets.tile`myTile4`, assets.tile`myTile0`)
tiles.coverAllTiles(assets.tile`myTile8`, assets.tile`myTile0`)
tiles.coverAllTiles(assets.tile`myTile9`, assets.tile`myTile0`)
tiles.coverAllTiles(assets.tile`myTile7`, assets.tile`myTile0`)
tiles.coverAllTiles(assets.tile`myTile10`, assets.tile`myTile0`)
archerRadius = 24
PURPLE = sprites.create(img`
    . . . . . . . . . . 
    . . . c c . . . . . 
    . . c c c c . . . . 
    . c c c c c c . . . 
    c c c c c c c c . . 
    c c c c c c c c . . 
    . . . c c . . . . . 
    . . . c c . . . . . 
    . . . c c . . . . . 
    . . . . . . . . . . 
    `, SpriteKind.Player)
controller.moveSprite(PURPLE, 70, 70)
PURPLE.setFlag(SpriteFlag.GhostThroughWalls, true)
MONKEY = sprites.create(assets.image`MONKEY`, SpriteKind.Icon)
MONKEY.top = 1
MONKEY.left = 80
info.setLife(20)
game.onUpdate(function () {
    if (thingWeAreHolding) {
        thingWeAreHolding.setPosition(PURPLE.x, PURPLE.y)
    }
})
game.onUpdateInterval(1000, function () {
    newEnemy = sprites.create(img`
        . 2 2 2 2 2 2 . 
        2 f f 2 2 f f 2 
        2 2 f 2 2 f 2 2 
        2 2 f 2 2 f 2 2 
        2 2 2 2 2 2 2 2 
        2 2 2 f f 2 2 2 
        2 2 f 2 2 f 2 2 
        . 2 2 2 2 2 2 . 
        `, SpriteKind.Enemy)
    tiles.placeOnRandomTile(newEnemy, assets.tile`myTile1`)
    newEnemy.vy = enemySpeed
    sprites.setDataNumber(newEnemy, "health", 2)
})
game.onUpdateInterval(1000, function () {
    for (let value of sprites.allOfKind(SpriteKind.Tower)) {
        if (sprites.readDataString(value, "name") == "MONKEY" && value != thingWeAreHolding) {
            target = spriteutils.getSpritesWithin(SpriteKind.Enemy, archerRadius, value)._pickRandom()
            if (target) {
                projectile = sprites.createProjectileFromSprite(img`
                    6 6 
                    6 6 
                    `, value, 0, 0)
                spriteutils.setVelocityAtAngle(projectile, spriteutils.angleFrom(value, target), 100)
                projectile.setFlag(SpriteFlag.GhostThroughWalls, true)
            }
        }
    }
})
