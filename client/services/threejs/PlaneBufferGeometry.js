/**
 * @author mrdoob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Plane.as
 */

const THREE = require('three');

THREE.PlaneBufferGeometry = function ( width, depth, widthSegments, depthSegments ) {

    THREE.BufferGeometry.call( this );

    this.type = 'PlaneBufferGeometry';

    this.parameters = {
        width: width,
        depth: depth,
        widthSegments: widthSegments,
        depthSegments: depthSegments
    };

    var gridX = Math.floor( widthSegments ) || 1;
    var gridZ = Math.floor( depthSegments ) || 1;

    var gridX1 = gridX + 1;
    var gridZ1 = gridZ + 1;

    var segment_width = width / gridX;
    var segment_depth = depth / gridZ;

    var vertices = new Float32Array( gridX1 * gridZ1 * 3 );

    var offset = 0;

    for ( var iz = 0; iz < gridZ1; iz ++ ) {

        var z = iz * segment_depth;

        for ( var ix = 0; ix < gridX1; ix ++ ) {

            vertices[ offset ] = ix * segment_width;
            vertices[ offset + 2 ] =  z;

            offset += 3;

        }

    }

    offset = 0;

    var indices = new ( ( vertices.length / 3 ) > 65535 ? Uint32Array : Uint16Array )( gridX * gridZ * 6 );

    for ( iz = 0; iz < gridZ; iz ++ ) {

        for ( ix = 0; ix < gridX; ix ++ ) {

            var a = ix + gridX1 * iz;
            var b = ix + gridX1 * ( iz + 1 );
            var c = ( ix + 1 ) + gridX1 * ( iz + 1 );
            var d = ( ix + 1 ) + gridX1 * iz;

            indices[ offset ] = a;
            indices[ offset + 1 ] = b;
            indices[ offset + 2 ] = d;

            indices[ offset + 3 ] = b;
            indices[ offset + 4 ] = c;
            indices[ offset + 5 ] = d;

            offset += 6;

        }

    }

    this.setIndex( new THREE.BufferAttribute( indices, 1 ) );
    this.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
};

THREE.PlaneBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.PlaneBufferGeometry.prototype.constructor = THREE.PlaneBufferGeometry;
