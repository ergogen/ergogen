import { expect } from 'chai';
import { Matrix, Vector } from '../src';

const A = Matrix.create([[1, 2, 3], [4, 5, 6]]);

describe('matrix', () => {
  it('should forward substitute', () => {
    const L = Matrix.create([[1, 0, 0], [0.5, 1, 0], [2, 3, 1]]);
    const b = Vector.create([1, 2, 3]);

    expect(L.forwardSubstitute(b)).to.vector.equal([1, 1.5, -3.5]);
  });

  it('should back substitute', () => {
    const L = Matrix.create([[4, 4], [0, 1]]);
    const b = Vector.create([1, 1.5]);

    expect(L.backSubstitute(b)).to.vector.equal([-1.25, 1.5]);
  });

  it('should solve', () => {
        // 2x + 3y = 2
        // 4x + 4y = 1
        // x = -1.25
        // y = 1.5
    const M = Matrix.create([[2, 3], [4, 4]]);

    const b = Vector.create([2, 1]);
    expect(M.solve(b)).to.vector.equal(Vector.create([1.5, -1.25]));
  });

  it('should partial pivot', () => {
    const B = Matrix.create([[3, 6, -9], [-4, 1, 10], [2, 5, -3]]);
    const P = Matrix.I(3);
    B.partialPivot(1, 1, P, B);

    expect(B).to.matrix.equal([[-4, 1, 10], [3, 6, -9], [2, 5, -3]]);

    expect(P).to.matrix.equal([[0, 1, 0], [1, 0, 0], [0, 0, 1]]);
  });

  describe('LU decomp', () => {
    it('should perform LU decomp on rectangular matrices', () => {
      const D = Matrix.create([[3, 6], [2, 3], [4, 3], [2, 120]]);

      const lu = D.luJs();
      expect(lu.P.x((lu.L.x(lu.U)))).to.matrix.equal(D);
    });

    it('should perform LU decomp', () => {
      const A = Matrix.create([[4, 2, 1, 4], [-9, 4, 3, 9], [11, 3, 11, 3], [-4, 5, 3, 1]]);

      const lu = A.lu();

      expect(lu.L.approxEql(Matrix.create([[1, 0, 0, 0], [-0.818181818181818, 1, 0, 0], [0.363636363636364, 0.140845070422535, 1, 0], [-0.363636363636364, 0.943661971830986, 0.921921921921922, 1]]))).to.be.true;

      expect(lu.U.approxEql(Matrix.create([[11, 3, 11, 3], [0, 6.454545454545455, 12, 11.454545454545455], [0, 0, -4.690140845070422, 1.295774647887324], [0, 0, 0, -9.912912912912912]]))).to.be.true;

      expect(lu.P).to.matrix.equal([[0, 0, 1, 0], [0, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 1]]);
    });
  });

  describe('PCA', () => {
    it('should PCA', () => {
      const pca = Matrix.create([[1, 2], [5, 7]]).pcaProject(1);

      expect(pca.Z.approxEql(Matrix.create([[-2.2120098720461616], [-8.601913944732665]]))).to.be.true;

      expect(pca.U.approxEql(Matrix.create([[-0.5732529283807336, -0.819378471832714], [-0.819378471832714, 0.5732529283807336]]))).to.be.true;
    });

    it('should recover', () => {
      const U = Matrix.create([[-0.5732529283807336, -0.819378471832714], [-0.819378471832714, 0.5732529283807336]]);
      const Z = Matrix.create([[-2.2120098720461616], [-8.601913944732665]]);

      expect(Z.pcaRecover(U)).to.matrix.equal([[1.268041136757554, 1.812473268636061], [4.931072358497068, 7.048223102871564]]);
    });
  });

  it('shoud triu', () => {
    const A2 = Matrix.create([[1, -1, 2, 2], [-1, 2, 1, -1], [2, 1, 3, 2], [2, -1, 2, 1]]);

    expect(A2.triu()).to.matrix.equal([[1, -1, 2, 2], [0, 2, 1, -1], [0, 0, 3, 2], [0, 0, 0, 1]]);

    expect(A2.triu(1)).to.matrix.equal([[0, -1, 2, 2], [0, 0, 1, -1], [0, 0, 0, 2], [0, 0, 0, 0]]);
  });

  it('should unroll', () => {
    expect(A.unroll()).to.vector.equal([1, 4, 2, 5, 3, 6]);
  });

  it('should slice', () => {
    const A2 = Matrix.create([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
    const A3 = A2.slice(2, 3, 2, 3);
    expect(A3).to.matrix.equal([[5, 6], [8, 9]]);
  });

  const U = Matrix.create([[-0.5110308651281587, 0.2132007163556105, 0.7071067811881557, 0.4397646068404634], [0.08729449334404742, -0.8528028654224428, 1.882731224298497e-12, 0.514885369921382], [-0.6856198518162525, -0.42640143271122105, -2.157344709257849e-12, -0.5900061329997158], [-0.5110308651281581, 0.21320071635561055, -0.7071067811849397, 0.4397646068456342]]);
  const S = Matrix.create([[5.85410196624969, 0, 0, 0], [0, 2.999999999999999, 0, 0], [0, 0, 1.0000000000000002, 0], [0, 0, 0, 0.8541019662496846]]);
  const V = Matrix.create([[-0.5110308651281575, 0.21320071635561047, -0.7071067811884307, -0.43976460684002194], [0.08729449334404744, -0.8528028654224414, -2.2043789591597237e-12, -0.5148853699213815], [-0.6856198518162527, -0.42640143271122066, 2.525858488366184e-12, 0.590006132999716], [-0.5110308651281579, 0.21320071635561044, 0.7071067811846652, -0.4397646068460757]]);

  const ASVD = Matrix.create([[1, -1, 2, 2], [-1, 2, 1, -1], [2, 1, 3, 2], [2, -1, 2, 1]]);

  it('should svd', () => {
    const svd = ASVD.svdJs();
    expect(svd.U).to.matrix.equal(U);
    expect(svd.S).to.matrix.equal(S);
    expect(svd.V).to.matrix.equal(V);
  });

  const QRin = Matrix.create([[1, -1, 2, 2], [-1, 2, 1, -1], [2, 1, 3, 2], [2, -1, 2, 1]]);

  const Qout = Matrix.create([[-0.316227766016838, 0.28342171556262064, 0.8226876614429064, -0.3779644730092273], [0.31622776601683794, -0.6883098806520787, 0.5323273103454103, 0.3779644730092272], [-0.6324555320336759, -0.6478210641431328, -0.19357356739833098, -0.37796447300922714], [-0.6324555320336759, 0.16195526603578317, 0.048393391849582745, 0.7559289460184544]]);
  const Rout = Matrix.create([[-3.1622776601683795, 0.9486832980505139, -3.478505426185217, -2.8460498941515415], [1.91055907392895e-17, -2.4698178070456938, -1.7410191098846692, 0.1214664495268375], [-2.254600901479451e-16, 2.0686390257580927e-16, 1.6937687147353957, 0.7742942695933234], [3.446764628337833e-17, 8.098938594673387e-17, 2.220446049250313e-16, -1.1338934190276815]]);

  it('should qr from javascript', () => {
    const qr = QRin.qrJs();
    expect(qr.Q).to.matrix.equal(Qout);
    expect(qr.R).to.matrix.equal(Rout);
  });

  it('should create a 1\'s matrix', () => {
    const Ones = Matrix.One(2, 3);
    expect(Ones).to.matrix.equal([[1, 1, 1], [1, 1, 1]]);
  });

  it('columns should be retrievable as vectors', () => {
    expect(A.column(2)).to.vector.equal([2, 5]);
  });

  it('should log', () => {
    expect(A.log()).to.matrix.equal([[0, 0.6931471805599453, 1.0986122886681098], [1.3862943611198906, 1.6094379124341003, 1.791759469228055]]);
  });

  it('should sum', () => {
    expect(A.sum()).to.equal(21);
  });

  it('should std', () => {
    expect(A.std()).to.vector.equal([1.5, 1.5, 1.5]);
  });

  it('should multiply', () => {
    expect(A.x(Matrix.create([[1, 2], [3, 4], [5, 6]]))).to.matrix.equal([[22, 28], [49, 64]]);
  });

  it('should multiply', () => {
    const B = Matrix.create([[1, 2, 3], [4, 5, 6]]);
    expect(A).to.matrix.equal(B);
  });

  it('should evaluate equal matrices', () => {
    const A = Matrix.create([[1, 2, 3], [4, 5, 6]]);
    const B = Matrix.create([[1, 2, 3], [4, 5, 6]]);

    expect(A).to.matrix.equal(B);
  });

  it('should evaluate inequal matrices', () => {
    const A = Matrix.create([[1, 2, 3], [4, 5, 6]]);
    const B = Matrix.create([[1, 2, 3], [4, 5, 7]]);

    expect(A).to.not.matrix.equal(B);
  });

  it('should snap', () => {
    expect(Matrix.create([[1, 1.1, 1.00000001], [4, 5, 6]]).snapTo(1)).to.matrix.equal([[1, 1.1, 1], [4, 5, 6]]);
  });

  it('should compute the minimum index of matrix rows', () => {
    expect(Matrix.create([[1, 2, 3], [2, 1, 3], [2, 1, 0]]).minColumnIndexes()).to.vector.equal([1, 2, 3]);
  });

  it('should compute the minimum value of matrix rows', () => {
    expect(Matrix.create([[1, 2, 3], [2, 1, 3], [2, 1, 0]]).minColumns()).to.vector.equal([1, 1, 0]);
  });

  it('should compute the maximum index of matrix rows', () => {
    expect(Matrix.create([[1, 2, 3], [2, 3, 2], [2, 1, 0]]).maxColumnIndexes()).to.vector.equal([3, 2, 1]);
  });

  it('should compute the maximum value of matrix rows', () => {
    expect(Matrix.create([[1, 2, 3], [2, 1, 3], [2, 1, 0]]).maxColumns()).to.vector.equal([3, 3, 2]);
  });
});
