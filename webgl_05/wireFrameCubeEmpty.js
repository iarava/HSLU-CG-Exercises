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
function WireFrameCube(gl, color) {
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
            -0.5,-0.5,-0.5,  //v0
            0.5,-0.5,-0.5,   //v1
            0.5,-0.5,0.5,    //v2
            -0.5,-0.5,0.5,   //v3
            -0.5,0.5,-0.5,   //v4
            0.5,0.5,-0.5,    //v5
            0.5,0.5,0.5,     //v7
            -0.5,0.5,0.5     //v6
        ];
        var buffer  = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    }


    function defineEdges(gl) {
        // define the edges for the cube, there are 12 edges in a cube
        var vertexIndices = [
            //vorne
            0,1,2,
            2,3,0,

            2,1,0,
            0,3,2,

            //hinten
            4,5,6,
            6,7,4,

            6,5,4,
            4,7,6,

            //unten
            0,1,5,
            5,4,0,

            5,1,0,
            0,4,5,

            //oben
            3,2,6,
            6,7,3,

            6,2,3,
            3,7,6,

            //links
            3,0,4,
            4,7,3,

            4,0,3,
            3,7,4,

            //rechts
            1,2,6,
            6,5,1,

            6,2,1,
            1,5,6
        ];
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
        return buffer;
    }

    return {
        bufferVertices: defineVertices(gl),
        bufferEdges: defineEdges(gl),
        color: color,

        draw: function(gl, aVertexPositionId, aVertexColorId) {
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color), gl.STATIC_DRAW);
            gl.vertexAttribPointer(aVertexColorId, 4, gl.FLOAT, false, 0,0);
            gl.enableVertexAttribArray(aVertexColorId);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
            gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexPositionId);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferEdges);

            gl.drawElements(gl.LINES, 72 /* Anzahl Indices */ , gl.UNSIGNED_SHORT, 0);
        }
    }
}



