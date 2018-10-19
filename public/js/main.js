import Compositor from './Compositor.js';
import {loadLevel} from './loaders.js';
import {loadMarioSprites, loadBackgroundSprites} from './sprite.js';
import {createBackgroungLayer} from './layer.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext('2d');

function createSpriteLayer(sprite, pos) {
	return function drawSpriteLayer(context) {
		for (let i = 0; i < 20; ++i) {
			sprite.draw('idle', context, pos.x + i * 16, pos.y);	
		}
		
	}
}

//Promise オブジェ loadBackgroundSprites, loadLevelがresolveされたらthenを呼ぶ
Promise.all([
	loadMarioSprites(),
	loadBackgroundSprites(),
	loadLevel('1-1'),
])
.then(([marioSprites, backgroundSprites,level]) => {
	const comp = new Compositor();
	const backgroundLayer = createBackgroungLayer(level.backgrounds, backgroundSprites);		
	comp.layers.push(backgroundLayer);

	const pos = {
		x: 0,
		y: 0,
	}

	const spriteLayer = createSpriteLayer(marioSprites, pos);
	comp.layers.push(spriteLayer);

	function update() {
		comp.draw(context);
		pos.x += 2;
		pos.y += 2;
		requestAnimationFrame(update);	
	}

	update();
});