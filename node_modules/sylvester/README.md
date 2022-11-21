# sylvester

Modern and expanded implementation of James Coglan's "Sylvester" matrix math library. The original project can be found at http://sylvester.jcoglan.com/

# Documentation

The original documentation for "Sylvester" should help you through basic operations. An intro that contains node-specific features  can also be found {on Chris Umbel's blog}[http://www.chrisumbel.com/article/sylvester_node_js_matrix_vector_math]. We're looking for someone to help get the documentation situation under control.

# Installation

    npm install sylvester

# Usage

## New Stuff

First I'd like to show some examples of features that aren't in the standard (non-node) Sylvester. I'll likely attempt to commit these back to Sylvester at some point soon.

Note that the decompositions are all available in pure JavaScript, but if the [lapack](https://github.com/NaturalNode/node-lapack) NPM is installed with LAPACK built as a shared library then efficient native code will be used. The LAPACK integration is still *highly* experimental.

### Vector

    require('sylvester');
    var a = $V([1, 2, 3]);

element-wise log:

    console.log(a.log());

norm computation:

    console.log(a.norm());

element-wise multiplication:

    a.elementMultiply(vector);

element-wise division:

    a.elementDivide(vector);

remove first n nodes:

    a.chomp(n);

return vector with first n nodes:

    a.top(n);

add all elements into a single scalar:

    a.sum()

multiply all elements into a single scalar:

    a.product()

return a vector with the elements parameter on the bottom:

    a.augment(elements)

### Matrix

    var A = $M([[1, 2, 3], [4, 5, 6]]);

return subset of rows, columns:

    // startRow, endRow, startCol, endCol
    A.slice(2, 3, 2, 3);

divide matricies:

    A.div($M([[0.5, 1], [1, 2], [2, 3]]));

scalar addition/subtraction

    A.add(1);
    A.subtract(1);

element-wise log:

    console.log(A.log());

element-wise multiplication:

    A.elementMultiply(vector)

add all	elements into a	single scalar:

    A.sum()

returns a vector of the indexes of maximum values ([3 3]):

    $M([[1, 2, 3], [5, 4, 6]]).maxColumnIndexes()

returns a vector of minimum column indexes ([1 2]):

    $M([[1, 2, 3], [5, 4, 6]]).minColumnIndexes();

returns a vector of max values ([3 6]):

    $M([[1, 2, 3], [5, 4, 6]]).maxColumns()

returns a vector of minimum values ([1 4]):

    $M([[1, 2, 3], [5, 4, 6]]).minColumns()

create a 2x3 matrix of ones:

    var Ones = Matrix.One(2, 3);

LU decomposition (with partial pivoting)

   var lu = A.lu();
   console.log(lu.L);
   console.log(lu.U);
   console.log(lu.P);

QR decomposition (feature still inefficient and experimental, but uses pure javascript):

    var qr = A.qr();
    console.log(qr.Q);
    console.log(qr.R);

SVD decomposition (feature still inefficient and experimental, but uses pure javascript):

    var svd = A.svd();
    console.log(svd.U);
    console.log(svd.S);
    console.log(svd.V);

PCA

    var A = $M([[1, 2], [5, 7]]).pcaProject(1).eql($M([
                [-2.2120098720461616],
                [-8.601913944732665]
            ]);
    var pca = A.pcaProject(1);
    var Z = pca.Z;
    var A = Z.pcaRecover(pca.U);

Solving systems of equations

    // sovle Ax = b for x
    var A = $M([[2, 4], [2, 1]]);
    var b = $V([1, 0]);
    console.log(A.solve(b));

== Old Stuff

Below is a basic illustration of standard matrix/vector math using the standard
Sylvester API. This documentation is rather incomplete and for further details please consult {the official sylvester API documentation}[http://sylvester.jcoglan.com/docs] at http://sylvester.jcoglan.com/docs.

### Vectors

    require('sylvester');

create two vectors:

    var a = $V([1, 2, 3]);
    var b = $V([2, 3, 4]);

compute the dot product:

    var r = a.dot(b);

add two vectors:

    var c = a.add(b);

multiply by scalar:

    var d = a.x(2);

### Matrices

    require('sylvester');

create two matrices:

    var A = $M([[1, 2], [3, 4]]);
    var B = $M([[1, 2, 3], [4, 5, 6]]);

multiply the matrices:

    var C = A.x(B);

transpose a matrix:

    var B_T = B.transpose();
    // B is 2x3, B_T is 3x2

