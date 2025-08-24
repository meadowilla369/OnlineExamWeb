const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { SBD, ho_va_ten, nam_sinh, nghe_nghiep, chuc_vu, don_vi_cong_ty, bo_phan, MK } = req.body;

    // Kiểm tra xem SBD đã tồn tại chưa
    const existingUser = await User.findBySBD(SBD);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Số báo danh đã tồn tại'
      });
    }

    // Hash password
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(MK, saltRounds);

    // Tạo thí sinh mới
    const UserData = {
      SBD,
      ho_va_ten,
      nam_sinh,
      nghe_nghiep,
      chuc_vu,
      don_vi_cong_ty,
      bo_phan,
      MK: hashedPassword
    };

    await User.create(UserData);

    res.status(200).json({
      success: true,
      message: 'Đăng ký thí sinh thành công',
      data: {
        SBD,
        ho_va_ten,
        nam_sinh,
        nghe_nghiep,
        chuc_vu,
        don_vi_cong_ty,
        bo_phan
      }
    });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ'
    });
  }
}

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { SBD, MK } = req.body;

    // Tìm thí sinh theo SBD
    const user = await User.findBySBD(SBD);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Số báo danh hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(MK, user.MK);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Số báo danh hoặc mật khẩu không đúng'
      });
    }

    // Tạo JWT token
    const accessToken = jwt.sign(
      { SBD: user.SBD },
      process.env.JWT_SECRET,
      { expiresIn: '125m' }
    );
    const refreshToken = jwt.sign(
      { SBD: user.SBD },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // Gửi token về client
    res.cookie(
      "jwt",
      refreshToken,
      {
        httpOnly: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60  * 1000,
      }
    )

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        accessToken,
        User: {
          SBD: user.SBD,
          ho_va_ten: user.ho_va_ten,
          nam_sinh: user.nam_sinh,
          nghe_nghiep: user.nghe_nghiep,
          chuc_vu: user.chuc_vu,
          don_vi_cong_ty: user.don_vi_cong_ty,
          bo_phan: user.bo_phan
        }
      }
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ'
    });
  }
}

// Đăng xuất
exports.logout = (req, res) => {
  try {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None" });
    res.json({
      success: true,
      message: 'Đăng xuất thành công'
    });
  } catch (error) {
    console.error('Lỗi đăng xuất:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ'
    });
  }
}
// Lấy thông tin của tất cả thí sinh
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll(50, 0);
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Lỗi lấy danh sách thí sinh:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ'
    });
  }
}

