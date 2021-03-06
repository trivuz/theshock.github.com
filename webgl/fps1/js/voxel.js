/** @class Voxel */
atom.declare( 'Voxel', {

	active: false,

	/**
	 *
	 * @param {String} material
	 * @param {Number[]} position
	 */
	initialize: function (material, position) {
		this.material    = material;
		this.position    = position;
		this.modelMatrix = mat4.create();

		mat4.identity (this.modelMatrix);
		mat4.translate(this.modelMatrix, this.position);

		// split cells between each other
		 mat4.translate(this.modelMatrix, this.position);
	},

	/** @return {String} */
	dump: function () {
		return 'Voxel ' + vec3.str(this.position) + ' (' + this.material + ')';
	},

	/** @return {Voxel} */
	drawItem: function (gl, program) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.builder.textureBuffer);
		gl.vertexAttribPointer(program.attributes['textureCoord']  , 2, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.builder.positionBuffer);
		gl.vertexAttribPointer(program.attributes['vertexPosition'], 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.builder.normalsBuffer);
		gl.vertexAttribPointer(program.attributes['vertexNormal']  , 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.builder.indicesBuffer);

		gl.uniformMatrix4fv(program.uniforms['modelMatrix'], false, this.modelMatrix);
		gl.uniform1f       (program.uniforms['activeVoxel'], this.active ? 1.0 : 0.0);

		gl.drawElements(gl.TRIANGLES, this.builder.indices.length, gl.UNSIGNED_SHORT, 0);
		return this;
	},

	/** @return {Voxel} */
	buildBuffers: function (container) {
		this.builder = container.getBuilder(this.getMap());
		return this;
	},

	/** @return {Object} */
	getMap: function () {
		return this.constructor.mapping[this.material];
	}

});

Voxel.mapping = {
	glass: { floor: [3,3], wall : [3,3], ceil : [3,3], name: 'glass' },
	logo : { floor: [3,1], wall : [3,1], ceil : [3,1], name: 'logo'  },
	rock : { floor: [3,2], wall : [3,2], ceil : [3,2], name: 'rock'  },
	grass: { floor: [2,2], wall : [2,1], ceil : [2,3], name: 'grass' },
	tree : { floor: [1,2], wall : [1,1], ceil : [1,3], name: 'tree'  },
	sand : { floor: [0,2], wall : [0,1], ceil : [0,3], name: 'sand'  }
};

/** @return {Voxel[]} */
Voxel.baseWorld = function () {
	var x, z, i,
		result = [],
		materials = Object.keys(this.mapping);

	materials.erase('rock');

	for (x = 0; x <= 8; x++) {
		for (z = 0; z <= 8; z++) {
			result.push(
				new Voxel('rock', vec3.create([x,-1,z]))
			);
		}
	}

	for (i = 50; i--;) {
		result.push(
			new Voxel(materials.random, vec3.create([
				Number.random(0, 8),Number.random(0, 3),Number.random(0, 8)
			]))
		);
	}

	return result;
};

Voxel.tinyWorld = function () {
	return [
		new Voxel('rock', vec3.create([-2,-2,-2])),
		new Voxel('rock', vec3.create([ 2,-2,-2])),
		new Voxel('logo', vec3.create([-2,-2, 2])),
		new Voxel('rock', vec3.create([ 2,-2, 2])),
		new Voxel('tree', vec3.create([-2, 2,-2])),
		new Voxel('tree', vec3.create([ 2, 2,-2])),
		new Voxel('tree', vec3.create([-2, 2, 2])),
		new Voxel('sand', vec3.create([ 2, 2, 2]))
	];
};
