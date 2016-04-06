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
        var colors = ["red", "green","blue"];
        for (var i=0;i<50;i++) {
            var particle = new Particle(
                    pos, 
                    Math.PI*2 * Math.random(), 
                    Math.random()*4, 
                    Math.random()*1000 + 2000,
                    colors[Math.floor(Math.random()*3)]);
            entities.push(particle.asEntity());
        }
    }
    
    function Particle(start, angle, speed, timeToLive, color) {
        var entity = new Entity();
        var pos = {
            x: start.x,
            y: start.y
        };
        
        var redModifier = 1;
        var blueModifier = 1;
        var greenModifier = 1;
        
        if (color === 'red') {
            redModifier = 0.2;
        }
        
        if (color === 'blue') {
            blueModifier = 0.2;
        }
        
        if (color === 'green') {
            greenModifier = 0.2;
        }
        
        var velocity = rotatedIdentityX(angle);
        velocity.x *= speed;
        velocity.y *= speed;
        
        this.asEntity = function() {
            return entity;
        };
        
        entity.origin = function() {
            return pos;
        };
        
        var gravity = 0.02;
        
        var elapsedSum = 0;
        var timeOfFrame = 1000/60;
        entity.simulate = function(elapsed) {
            velocity.y +=  gravity;
            
            pos.x += velocity.x * elapsed / timeOfFrame;
            pos.y += velocity.y * elapsed / timeOfFrame;
            elapsedSum += elapsed;
        };
        
        entity.isAlive = function() { return elapsedSum < timeToLive;};
        
        entity.render = function(ctx) {
            var age = elapsedSum/timeToLive;
            ctx.fillStyle = colorFrom0To1(1-age*redModifier,1 - age*greenModifier,1-age*blueModifier);
            ctx.beginPath();
            ctx.arc(0, 0, 5 - age*4, 0, Math.PI*2, true); 
            ctx.fill();
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

    function colorFrom0To1(red,green,blue) {
        return "#"+asHex(Math.floor(red*255)) + asHex(Math.floor(green*255)) + asHex(Math.floor(blue*255));
        
    }
    
    function asHex(byte) {
        var chars = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
        return chars[Math.floor(byte/16)]+chars[byte%16];
    }
}