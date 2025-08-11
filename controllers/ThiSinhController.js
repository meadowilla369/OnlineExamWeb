const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ThiSinh = require('../models/ThiSinh');

class ThiSinhController {
  // Đăng ký thí sinh mới
  static async register(req, res) {
    try {
      const { SBD, ho_va_ten, nam_sinh, nghe_nghiep, chuc_vu, don_vi_cong_ty, bo_phan, MK } = req.body;

      // Kiểm tra xem SBD đã tồn tại chưa
      const existingThiSinh = await ThiSinh.findBySBD(SBD);
      if (existingThiSinh) {
        return res.status(409).json({
          success: false,
          message: 'Số báo danh đã tồn tại'
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(MK, saltRounds);

      // Tạo thí sinh mới
      const thiSinhData = {
        SBD,
        ho_va_ten,
        nam_sinh,
        nghe_nghiep,
        chuc_vu,
        don_vi_cong_ty,
        bo_phan,
        MK: hashedPassword
      };

      await ThiSinh.create(thiSinhData);

      res.status(201).json({
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
      console.error('Register error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Đăng nhập
  static async login(req, res) {
    try {
      const { SBD, MK } = req.body;

      // Tìm thí sinh theo SBD
      const thiSinh = await ThiSinh.findBySBD(SBD);
      if (!thiSinh) {
        return res.status(401).json({
          success: false,
          message: 'Số báo danh hoặc mật khẩu không đúng'
        });
      }

      // Kiểm tra password
      const isPasswordValid = await bcrypt.compare(MK, thiSinh.MK);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Số báo danh hoặc mật khẩu không đúng'
        });
      }

      // Tạo JWT token
      const token = jwt.sign(
        { SBD: thiSinh.SBD },
        process.env.JWT_SECRET,
        { expiresIn: '2.5h' }
      );

      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        data: {
          token,
          thiSinh: {
            SBD: thiSinh.SBD,
            ho_va_ten: thiSinh.ho_va_ten,
            nam_sinh: thiSinh.nam_sinh,
            nghe_nghiep: thiSinh.nghe_nghiep,
            chuc_vu: thiSinh.chuc_vu,
            don_vi_cong_ty: thiSinh.don_vi_cong_ty,
            bo_phan: thiSinh.bo_phan
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }

  // Lấy thông tin thí sinh hiện tại
  static async getProfile(req, res) {
    try {
      const { thiSinh } = req;
      
      res.json({
        success: true,
        data: {
          SBD: thiSinh.SBD,
          ho_va_ten: thiSinh.ho_va_ten,
          nam_sinh: thiSinh.nam_sinh,
          nghe_nghiep: thiSinh.nghe_nghiep,
          chuc_vu: thiSinh.chuc_vu,
          don_vi_cong_ty: thiSinh.don_vi_cong_ty,
          bo_phan: thiSinh.bo_phan,
          created_at: thiSinh.created_at,
          updated_at: thiSinh.updated_at
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server'
      });
    }
  }
}

module.exports = ThiSinhController;