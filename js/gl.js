


var GLU = function() 
{
	var canvas = document.getElementById('canvas');
	
	this.gl = canvas.getContext('experimental-webgl', {antialias: true});
	if (!this.gl) 
	{
 		this.gl = canvas.getContext("webgl", {antialias: true});
	}
}


// Creates and compiles a shader.
GLU.prototype.compileShader = function(shaderName, shaderSource, shaderType) 
{
	// Create the shader object
	var shader = this.gl.createShader(shaderType);

	this.gl.shaderSource(shader, shaderSource); // Set the shader source code.
	this.gl.compileShader(shader);              // Compile the shader

	// Check if it compiled
	var success = gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
	if (!success) 
	{
		// Something went wrong during compilation; get the error
		throw "could not compile " + shaderName + " shader:" + this.gl.getShaderInfoLog(shader);
	}

	return shader;
};


GLU.prototype.createProgram = function(vertexShader, fragmentShader) 
{
	// create a program.
	var program = gl.createProgram();

	// attach the shaders.
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);

	// link the program.
	gl.linkProgram(program);

	// Check if it linked.
	var success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!success) {
	  // something went wrong with the link
	  throw ("program filed to link:" + gl.getProgramInfoLog (program));
	}

	return program;
};


GLU.prototype.createProgramsFromScripts = function(shader_names)
{
	var shader_files = [];
	for (var i = 0; i < shader_names.length; i++) 
	{
		var name = shader_names[i];
		shader_files.push( "text!shaders/"+name+'-vertex-shader.glsl' );
		shader_files.push( "text!shaders/"+name+'-fragment-shader.glsl' );
	}

	var gl = this.gl;

	require(

		shader_files,

		function() 
		{
			var shader_programs = {};

			//console.log("arguments: " +  arguments);

			var n = 0;
			for (var i = 0; i<(arguments.length)/2; i++) 
			{
				vertexShaderCode   = arguments[n];
				fragmentShaderCode = arguments[n+1]

				console.log("this: " +  this);
				console.log("this.compileShader: " + this.compileShader);

				vertexShader       = this.compileShader(shader_names[i], vertexShaderCode, gl.VERTEX_SHADER);
				fragmentShader     = this.compileShader(shader_names[i], fragmentShaderCode, gl.FRAGMENT_SHADER);

				shader_programs[ shader_names[i] ] = this.createProgram(gl, vertexShader, fragmentShader);
				n += 2;
			}

			onShaderProgramsLoaded(shader_programs);
		}
	);
}

GLU.prototype.createAndSetupTexture = function(textureUnitIndex, width, height) 
{
	var gl = this.gl;
	var texture = gl.createTexture();

	gl.activeTexture(gl.TEXTURE0+textureUnitIndex);
	gl.bindTexture(gl.TEXTURE_2D, texture);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);

	return texture;
}


