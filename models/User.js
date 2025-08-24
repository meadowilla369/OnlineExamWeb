const db = require('../config/database');

class User {
  static async create(UserData) {
    try {
      const [result] = await db.execute(
        `INSERT INTO User (SBD, ho_va_ten, nam_sinh, nghe_nghiep, chuc_vu, don_vi_cong_ty, bo_phan, MK) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          UserData.SBD,
          UserData.ho_va_ten,
          UserData.nam_sinh,
          UserData.nghe_nghiep,
          UserData.chuc_vu,
          UserData.don_vi_cong_ty,
          UserData.bo_phan,
          UserData.MK
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
        'SELECT * FROM User WHERE SBD = ?',
        [SBD]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM User ORDER BY created_at DESC',
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
        `UPDATE User SET ${fields.join(', ')} WHERE SBD = ?`,
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
        'DELETE FROM User WHERE SBD = ?',
        [SBD]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async count() {
    try {
      const [rows] = await db.execute('SELECT COUNT(*) as total FROM User');
      return rows[0].total;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;