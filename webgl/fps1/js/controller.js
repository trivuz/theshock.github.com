/** @class Controller */
atom.declare( 'Controller', {

	initialize: function () {
		atom.ImagePreloader.run({
			'textures': 'textures.png',
			'control' : 'control.png',
			'point'   : 'control-point.png'
		}, this.start, this);
	},

	player: null,
	render: null,

	start: function (images) {
		var onTick = this.onTick.bind(this);

		this.player = new Player(images);

		this.render = new Render(function () {
			atom.frame.add( onTick );
		});
		this.render.setTexture(images.get('textures'));

		this.voxels = Voxel.baseWorld();

		this.voxels.forEach(function (voxel) {
			this.render.addItem(voxel);
		}.bind(this));

		this.requestPointerLock(this.render.canvas);
	},

	onTick: function (time) {
		this.player.onTick(time);
		this.render.positionCamera(this.player);
		this.render.redraw();
	},

	requestPointerLock: function (element) {
		var player = this.player;

		function onMove (e) {
			player.pointer(e.movementX, e.movementY);
		}

		atom.dom(element).bind('click', function () {
			atom.pointerLock.request(element, onMove);
		});
	}

});


atom.dom(Controller);