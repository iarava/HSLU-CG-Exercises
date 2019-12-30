/**
 * Created by toko on 13.05.17.
 */

/**
 *
 * Define a wire frame cube with methods for drawing it.
 *
 * @param gl
 * @param color the color of the cube
 * @returns object with draw method
 * @constructor
 */
function ColorCube(gl, color) {
    function defineVertices(gl) {
        // define the vertices of the cube
        /*
                  v7-----v6
                 / |    / |
                v3-|--v2  |
                | v4---|-v5
                |/     |/
                v0----v1
         */
        var vertices = [
            // vordere Fläche
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5,  0.5,
            -0.5, -0.5,  0.5,

            // hintere Fläche
            -0.5,  0.5, -0.5,
            -0.5,  0.5,  0.5,
            0.5,  0.5,  0.5,
            0.5,  0.5, -0.5,

            // obere Fläche
            -0.5, -0.5, -0.5,
            -0.5,  0.5, -0.5,
            0.5,  0.5, -0.5,
            0.5, -0.5, -0.5,

            // untere Fläche
            -0.5, -0.5,  0.5,
            0.5, -0.5,  0.5,
            0.5,  0.5,  0.5,
            -0.5,  0.5,  0.5,

            // rechte Fläche
            -0.5, -0.5, -0.5,
            -0.5, -0.5,  0.5,
            -0.5,  0.5,  0.5,
            -0.5,  0.5, -0.5,

            // linke Fläche
            0.5, -0.5, -0.5,
            0.5,  0.5, -0.5,
            0.5,  0.5,  0.5,
            0.5, -0.5,  0.5,
        ];
        var buffer  = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    }

    function defineNormals(gl) {
        var frontNormal = [0.0, -1.0, 0.0];
        var backNormal = [0.0, 1.0, 0.0];
        var topNormal = [0.0, 0.0, -1.0];
        var bottomNormal = [0.0, 0.0, 1.0];
        var rightNormal = [-1.0, 0.0, 0.0];
        var leftNormal = [1.0, 0.0, 0.0];

        // make 4 entries, one for each vertex
        var frontSideNormal    = frontNormal.concat(frontNormal, frontNormal, frontNormal);
        var backSideNormal   = backNormal.concat(backNormal, backNormal, backNormal);
        var topSideNormal   = topNormal.concat(topNormal, topNormal, topNormal);
        var bottomSideNormal    = bottomNormal.concat(bottomNormal, bottomNormal, bottomNormal);
        var rightSideNormal     = rightNormal.concat(rightNormal, rightNormal, rightNormal);
        var leftSideNormal  = leftNormal.concat(leftNormal, leftNormal, leftNormal);

        var allSidesNormal = frontSideNormal.concat(backSideNormal, topSideNormal, bottomSideNormal, rightSideNormal, leftSideNormal);

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allSidesNormal), gl.STATIC_DRAW);
        return buffer;
    }


    function defineEdges(gl) {
        // define the edges for the cube, there are 12 edges in a cube
        var vertexIndices = [
            //vorne
            0,1,2,
            0,2,3,

            //hinten
            4,5,6,
            4,6,7,

            //oben
            8,9,10,
            8,10,11,

            //unten
            12,13,14,
            12,14,15,

            //rechts
            16,17,18,
            16,18,19,

            //links
            20,21,22,
            20,22,23
        ];
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
        return buffer;
    }

    function defineColors(colors){
        var generatedColors = [];

        for(j=0; j<6;j ++){
            var c = colors[j];
            for(var i=0; i<4; i++){
                generatedColors = generatedColors.concat(c);
            }
        }

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatedColors), gl.STATIC_DRAW);
        return buffer;
    }

    return {
        bufferVertices: defineVertices(gl),
        bufferNormals: defineNormals(gl),
        bufferEdges: defineEdges(gl),
        bufferColor: defineColors(color),

        draw: function(gl, aVertexPositionId, aVertexNormalId, aVertexColorId, uEnableTextureId) {
            gl.uniform1i(uEnableTextureId, 0);

            // normal
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferNormals);
            gl.vertexAttribPointer(aVertexNormalId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexNormalId);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferColor);
            gl.vertexAttribPointer(aVertexColorId, 3, gl.FLOAT, false, 0,0);
            gl.enableVertexAttribArray(aVertexColorId);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
            gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexPositionId);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferEdges);

            gl.drawElements(gl.TRIANGLES, 36 /* Anzahl Indices */ , gl.UNSIGNED_SHORT, 0);

            // disable all attributes
            gl.disableVertexAttribArray(aVertexPositionId);
            gl.disableVertexAttribArray(aVertexNormalId);
            gl.disableVertexAttribArray(aVertexColorId);
        }
    }
}



