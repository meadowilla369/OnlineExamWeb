
USE online_exam_web;

-- Thông tin thí sinh (Student Information)
CREATE TABLE User (
    SBD VARCHAR(20) PRIMARY KEY,
    ho_va_ten VARCHAR(100) NOT NULL,
    nam_sinh DATE NOT NULL,
    nghe_nghiep VARCHAR(50) NOT NULL,
    chuc_vu VARCHAR(50) NOT NULL,
    don_vi_cong_ty VARCHAR(100) NOT NULL,
    bo_phan VARCHAR(50) NOT NULL,
    MK VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Kết quả thi (Exam Results)
CREATE TABLE KetQuaThi (
    SBD VARCHAR(20) PRIMARY KEY,
    diem_trac_nghiem DECIMAL(5,2),
    diem_tu_luan DECIMAL(5,2),
    diem_tong DECIMAL(5,2),
    thoi_gian_bat_dau TIMESTAMP,
    thoi_gian_ket_thuc TIMESTAMP,
    so_lan_thoat_khoi_man_hinh INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (SBD) REFERENCES User(SBD) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Đề thi tự luận (Essay Questions)
CREATE TABLE DeTuLuan (
    ID_cau_hoi_tu_luan VARCHAR(50) PRIMARY KEY,
    noi_dung_cau_hoi TEXT NOT NULL,
    diem DECIMAL(4,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Đề thi trắc nghiệm (Multiple Choice Questions)  
CREATE TABLE DeTracNghiem (
    ID_cau_hoi_trac_nghiem VARCHAR(50) PRIMARY KEY,
    noi_dung_cau_hoi TEXT NOT NULL,
    diem DECIMAL(4,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Đáp án trắc nghiệm (Multiple Choice Answers)
CREATE TABLE DapAnTracNghiem (
    ID_dap_an_trac_nghiem VARCHAR(50) PRIMARY KEY,
    ID_cau_hoi_trac_nghiem VARCHAR(50) NOT NULL,
    noi_dung_dap_an TEXT NOT NULL,
    isCorrect BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ID_cau_hoi_trac_nghiem) REFERENCES DeTracNghiem(ID_cau_hoi_trac_nghiem) ON DELETE CASCADE ON UPDATE CASCADE,
    
    INDEX idx_dap_an_cau_hoi (ID_cau_hoi_trac_nghiem),
    INDEX idx_dap_an_correct (isCorrect)
);

-- Bảng lưu câu trả lời trắc nghiệm của thí sinh
CREATE TABLE TraLoiTracNghiem (
    ID_tra_loi VARCHAR(50) PRIMARY KEY DEFAULT (UUID()),
    SBD VARCHAR(20) NOT NULL,
    ID_cau_hoi_trac_nghiem VARCHAR(50) NOT NULL,
    ID_dap_an_trac_nghiem VARCHAR(50),
    thoi_gian_tra_loi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (SBD) REFERENCES User(SBD) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ID_cau_hoi_trac_nghiem) REFERENCES DeTracNghiem(ID_cau_hoi_trac_nghiem) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ID_dap_an_trac_nghiem) REFERENCES DapAnTracNghiem(ID_dap_an_trac_nghiem) ON DELETE SET NULL ON UPDATE CASCADE,
    
    UNIQUE KEY unique_answer_per_question (SBD, ID_cau_hoi_trac_nghiem),
    INDEX idx_tra_loi_thi_sinh (SBD),
    INDEX idx_tra_loi_cau_hoi (ID_cau_hoi_trac_nghiem)
);

-- Bảng lưu câu trả lời tự luận của thí sinh
CREATE TABLE TraLoiTuLuan (
    ID_tra_loi VARCHAR(50) PRIMARY KEY DEFAULT (UUID()),
    SBD VARCHAR(20) NOT NULL,
    ID_cau_hoi_tu_luan VARCHAR(50) NOT NULL,
    noi_dung_tra_loi TEXT,
    diem_dat_duoc DECIMAL(4,2) DEFAULT 0,
    thoi_gian_tra_loi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (SBD) REFERENCES User(SBD) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ID_cau_hoi_tu_luan) REFERENCES DeTuLuan(ID_cau_hoi_tu_luan) ON DELETE CASCADE ON UPDATE CASCADE,
    
    UNIQUE KEY unique_essay_answer_per_question (SBD, ID_cau_hoi_tu_luan),
    INDEX idx_tra_loi_tu_luan_thi_sinh (SBD),
    INDEX idx_tra_loi_tu_luan_cau_hoi (ID_cau_hoi_tu_luan)
);

-- Bảng quản lý phiên thi (Exam Sessions)
CREATE TABLE PhienThi (
    ID_phien_thi VARCHAR(50) PRIMARY KEY DEFAULT (UUID()),
    SBD VARCHAR(20) NOT NULL,
    thoi_gian_bat_dau TIMESTAMP,
    thoi_gian_ket_thuc TIMESTAMP,
    trang_thai ENUM('CHUA_BAT_DAU', 'DANG_LAM', 'DA_HOAN_THANH', 'HET_THOI_GIAN') DEFAULT 'CHUA_BAT_DAU',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (SBD) REFERENCES User(SBD) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_phien_thi_sinh (SBD),
    INDEX idx_phien_trang_thai (trang_thai)
);