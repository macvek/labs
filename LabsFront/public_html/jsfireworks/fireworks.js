"use strict";

function Fireworks(canvasNode) {
    var ctx = canvasNode.getContext("2d");
    var size = {width:0,height:0};
    scheduleRenderLoop();
    
    this.resize = function(widthAndHeight) {
        $(canvasNode).css({
            width:widthAndHeight.width,
            height:widthAndHeight.height
        });
        
        size = widthAndHeight;
        canvasNode.width = widthAndHeight.width;
        canvasNode.height = widthAndHeight.height;
    };
    
    this.click = function(e) {
        explosionAt({x:e.clientX, y:e.clientY});
    };
    
    function scheduleRenderLoop() {
        requestAnimationFrame(renderLoop);
    }
    
    var lastRenderLoop;
    function renderLoop() {
        var now = new Date().getTime();
        var elapsed = now - lastRenderLoop;
        lastRenderLoop = now;
        
        simulate(elapsed);
        render();
        
        scheduleRenderLoop();
    }
    
    var entities = [];
    
    function Entity() {
        this.simulate = function() {
            unimplemented();
        };
        
        this.origin = function() {
            unimplemented();
            return {
                x:-1,
                y:-1
            };
        };
        
        this.angle = function() {
            unimplemented();
            return 0;
        };
        
        this.isAlive = function() {
            unimplemented();
            return false;
        };
        
        this.render = function() {
            unimplemented();
        };
        
        function unimplemented() {
            console.log("UNIMPLEMENTED ENTITY ACTION");
        }
    }
    
    function simulate(elapsed) {
        forEachEntity(function(entity) {
            entity.simulate(elapsed);
        });
        
        
        var aliveEntities = [];
        forEachEntity(function(entity) {
            if (entity.isAlive()) {
                aliveEntities.push(entity);
            }
        });
        
        entities = aliveEntities;
    }
    
    function forEachEntity(callback) {
        for (var i=0;i<entities.length;i++) {
            callback(entities[i]);
        }
        
    }
    
    function render() {
        ctx.clearRect(0, 0, size.width, size.height);
        
        forEachEntity(function(entity) {
            var origin = entity.origin();
            ctx.save();
            ctx.translate(origin.x, origin.y);
            entity.render(ctx);
            ctx.restore();
        });
        
    }
    
    function explosionAt(pos) {
        for (var i=0;i<10;i++) {
            var particle = new Particle(pos, Math.PI*2 * Math.random(), Math.random()*3, Math.random()*2000 + 1000);
            entities.push(particle.asEntity());
        }
    }
    
    function Particle(start, angle, speed, timeToLive) {
        var entity = new Entity();
        var pos = {
            x: start.x,
            y: start.y
        };
        
        var velocity = rotatedIdentityX(angle);
        velocity.x *= speed;
        velocity.y *= speed;
        
        this.asEntity = function() {
            return entity;
        };
        
        entity.origin = function() {
            return pos;
        };
        
        var elapsedSum = 0;
        entity.simulate = function(elapsed) {
            pos.x += velocity.x;
            pos.y += velocity.y;
            elapsedSum += elapsed;
        };
        
        entity.isAlive = function() { return elapsedSum < timeToLive;};
        
        entity.render = function(ctx) {
            ctx.fillStyle = "white";
            ctx.fillRect(-5,-5,10,10);
        };
    }
    
    function rotatedIdentityX(a) {
        var v = {x:1,y:0};
        var cosA = Math.cos(a);
        var sinA = Math.sin(a);
        var px = v.x * cosA - v.y * sinA; 
        var py = v.x * sinA + v.y * cosA;
        
        return {x:px, y:py};
    }

}