const db = require('../config/database');

class ThiSinh {
  static async create(thiSinhData) {
    try {
      const [result] = await db.execute(
        `INSERT INTO thisinh (SBD, ho_va_ten, nam_sinh, nghe_nghiep, chuc_vu, don_vi_cong_ty, bo_phan, MK) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          thiSinhData.SBD,
          thiSinhData.ho_va_ten,
          thiSinhData.nam_sinh,
          thiSinhData.nghe_nghiep,
          thiSinhData.chuc_vu,
          thiSinhData.don_vi_cong_ty,
          thiSinhData.bo_phan,
          thiSinhData.MK
        ]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async findBySBD(SBD) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM thisinh WHERE SBD = ?',
        [SBD]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll(limit = 50, offset = 0) {
    try {
      const [rows] = await db.execute(
        'SELECT SBD, ho_va_ten, nam_sinh, nghe_nghiep, chuc_vu, don_vi_cong_ty, bo_phan, created_at FROM thisinh LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async update(SBD, updateData) {
    try {
      const fields = [];
      const values = [];
      
      Object.keys(updateData).forEach(key => {
        if (key !== 'SBD' && updateData[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });
      
      if (fields.length === 0) {
        throw new Error('No fields to update');
      }
      
      values.push(SBD);
      
      const [result] = await db.execute(
        `UPDATE thisinh SET ${fields.join(', ')} WHERE SBD = ?`,
        values
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async delete(SBD) {
    try {
      const [result] = await db.execute(
        'DELETE FROM thisinh WHERE SBD = ?',
        [SBD]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async count() {
    try {
      const [rows] = await db.execute('SELECT COUNT(*) as total FROM thisinh');
      return rows[0].total;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ThiSinh;