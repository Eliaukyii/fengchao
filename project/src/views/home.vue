<template>
  <div class="content">
    <!-- 标题区域 -->
    <div class="title-group">
      <h2 class="title">物料关联管理</h2>
      <el-button type="primary" class="add" size="small" @click="open = true">
        <i class="el-icon-plus"></i>单个添加</el-button>
    </div>
    <!-- 上传区域 -->
    <el-upload class="upload-box" drag multiple action="http://localhost:3000/upload" :on-success="handleUploadSuccess" :before-upload="beforeUpload">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        点击或拖拽文件至此上传<br>
        <span class="sub-text">支持csv、xlsx、xls格式文件，单个不超过5MB</span>
      </div>
    </el-upload>
    <div class="button-group">
      <el-button size="small" class="template-btn" @click="downloadTemplate">下载模板</el-button>
      <el-button type="primary" size="small">开始导入</el-button>
    </div>

    <!-- 表格区域 -->
    <div class="table-container">
      <div class="table-header">
        <h2 class="sub-title">关联关系列表</h2>
        <div class="search-group">
          <el-input placeholder="震坤行SKU编码、T+存货编码" v-model="keyword" class="search-input" size="small" suffix-icon="el-icon-search">
            <el-select slot="prepend" placeholder="请选择" style="width: 100px" v-model="searchType">
              <el-option label="全部" value="1"></el-option>
              <el-option label="SKU编码" value="2"></el-option>
              <el-option label="存货编码" value="3"></el-option>
            </el-select>
          </el-input>
          <div class="action-btns">
            <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
            <el-button size="small" @click="exportAll">导出</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-table :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" style="width: 100%" border fit v-loading="loading" :header-cell-style="{'background-color':'#f5f7fa'}">
      <el-table-column prop="sku_code" label="震坤行SKU编码" align="center"></el-table-column>
      <el-table-column prop="inventry_code" label="T+存货编码" align="center"></el-table-column>
      <el-table-column prop="sku_name" label="震坤行SKU名称" align="center"></el-table-column>
      <el-table-column prop="inventry_code" label="T+存货名称" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="删除" placement="top">
            <i class="el-icon-delete danger-icon" @click="handleDelete(scope.row)"></i>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" background :page-sizes="[10, 20, 100, 500, 1000]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin-top: 20px" :pager-count="computedPagerCount">
    </el-pagination>
    <!-- 抽屉表单 -->
    <el-drawer title="单个添加" :visible.sync="open" :size="drawerSize" :direction="drawerDirection" :before-close="handleClose">
      <div class="drawer-content">
        <el-form ref="form" label-width="120px" :model="formData" label-position="top" style="padding: 20px" :rules="rules">
          <el-form-item label="震坤行SKU编码" prop="sku_code" class="drawer-item">
            <el-input v-model=" formData.sku_code" placeholder="请输入震坤行SKU编码" />
          </el-form-item>
          <el-form-item label="T+存货编码" prop="T_code" class="drawer-item">
            <el-input v-model="formData.T_code" placeholder="请输入T+存货编码" />
          </el-form-item>
          <el-form-item label="震坤行SKU名称" prop="sku_name" class="drawer-item">
            <el-input v-model=" formData.sku_name" placeholder="请输入震坤行SKU名称" />
          </el-form-item>
          <el-form-item label="T+存货名称" prop="T_name" class="drawer-item">
            <el-input v-model=" formData.T_name" placeholder="请输入存货名称" />
          </el-form-item>
        </el-form>
        <div class="drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')" :loading="loading">{{ loading ? '提交中 ...' : '保 存' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      tableData: [
        {
          sku_code: 20250001,
          inventry_code: "123456789",
          sku_name: "sku001",
          inventry_name: "存货001",
          createTime: "2025-01-01 12:00:00",
        },
        {
          sku_code: 20250002,
          inventry_code: "123456789",
          sku_name: "sku001",
          inventry_name: "存货002",
          createTime: "2025-01-01 12:00:00",
        },
      ],
      open: false,
      keyword: "",
      searchType: "",
      formData: {
        sku_code: "",
        sku_name: "",
        T_code: "",
        T_name: "",
      },
      loading: false,
      screenWidth: document.documentElement.clientWidth,
      currentPage: 1,
      pageSize: 10,
      total: 100,
      localPagerCount: 5,

      rules: {
        sku_code: [
          {
            required: true,
            message: "震坤行SKU编码不能为空",
            trigger: "blur",
          },
        ],
        T_code: [
          { required: true, message: "T+存货编码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    // 响应式抽屉设置
    drawerSize() {
      return this.screenWidth < 768 ? "60%" : "40%";
    },
    drawerDirection() {
      return this.screenWidth < 768 ? "btt" : "rtl";
    },
    computedPagerCount() {
      return this.screenWidth < 768 ? 3 : 5;
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleDelete(row) {
      console.log(row);
    },
    handleUploadSuccess(res, file) {
      console.log(res, file);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
      // this.getList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      // this.getList()
    },
    // getList(){
    //   getList().then((res)=>{
    //     this.tableData = res.data.list;
    //     this.total = res.data.total;
    //   })
    // },

    handleClose(done) {
      if (this.loading) {
        return;
      }
      this.$confirm("确定要提交表单吗？")
        .then((_) => {
          this.loading = true;
          this.timer = setTimeout(() => {
            done();
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false;
            }, 400);
          }, 2000);
        })
        .catch((_) => {});
    },
    cancelForm() {
      this.loading = false;
      this.open = false;
      this.resetForm();
      clearTimeout(this.timer);
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          console.log(this.form);
          this.resetForm();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    exportAll() {
      this.$confirm("确定要导出全部数据吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 导出逻辑
          console.log("导出全部数据");
        })
        .catch(() => {
          this.$message.info("已取消");
        });
    },
    beforeUpload(file) {
      const isExcel = ["xls", "xlsx", "csv"].includes(
        file.name.split(".").pop()
      );
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isExcel) {
        this.$message.error("只能上传Excel文件!");
      }
      if (!isLt5M) {
        this.$message.error("文件大小不能超过5MB!");
      }
      return isExcel && isLt5M;
    },
    downloadTemplate() {
      const filePath = "/example.xlsx";
      const link = document.createElement("a");
      link.href = filePath;
      link.setAttribute("download", "模板文件.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    handleSearch() {
      console.log(`搜索关键字: ${this.keyword}`);
    },
    handleResize() {
      this.screenWidth = document.documentElement.clientWidth;
      this.localPagerCount = this.computedPagerCount;
    },
  },
};
</script>

<style scoped>
.content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
/* 标题区域 */
.title-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 18px;
  color: #303133;
  margin: 0;
  font-weight: bold;
}
.upload-box {
  margin: 20px 0;
  position: relative;
}

::v-deep .el-upload {
  width: 100%;
}
::v-deep .el-upload-dragger {
  width: 100%;
  height: 220px;
  background-color: #f9fafb;
}
.sub-text {
  color: #909399;
  font-size: 12px;
}

.button-group {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

/* 表格区域 */
.table-container {
  margin-top: 24px;
  overflow-x: auto;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 16px;
}
.search-group {
  display: flex;
  /* flex-grow: 1; */
  gap: 10px;
}

.search-input {
  flex: 1;
  width: 400px;
}
.action-btns {
  flex-shrink: 0;
}
.el-pagination {
  margin-top: 20px;
  padding: 10px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}
/* 抽屉样式 */
.drawer-content {
  /* padding: 20px; */
  display: flex;
  flex-direction: column;
  height: 100%;
}

.form-actions {
  margin-top: 24px;
  text-align: right;
}

.danger-icon {
  color: #f56c6c;
  cursor: pointer;
  font-size: 16px;
}
/* ::v-deep .el-drawer {
  width: 400px;
} */
.sub-title {
  font-size: 18px;
  margin-top: 15px;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
}

.el-upload__text {
  font-size: 14px;
  line-height: 20px;
}
::v-deep .el-drawer__header {
  padding: 20px 20px;
  border-bottom: 1px solid #eeeeee;
  color: #333;
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 0px;
}
.drawer__footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  border-top: 1px solid #eeeeee;
  margin-top: auto;
  background-color: #f9fafb;
}
@media screen and (max-width: 768px) {
  .title-group {
    gap: 12px;
  }

  .add-btn {
    width: 100%;
  }

  /* .el-upload__text {
    font-size: 14px;
    line-height: 20px;
  } */

  .button-group {
    /* flex-direction: column; */
    width: 100%;
  }

  .button-group button {
    width: 100%;
  }

  .table-header {
    /* display: inline-block; */
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
  }
  /* .sub-title {
    font-size: 18px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: #333;
  } */

  .search-group {
    flex-direction: column;
  }
  .action-btns {
    margin-top: 5px;
  }
  .mobile-hidden {
    display: none;
  }
  
}
@media screen and (max-width: 480px) {
  .el-table__cell {
    padding: 8px !important;
  }

  .el-drawer__header {
    padding: 16px;
  }

  /* .drawer-item {
    margin-bottom: 0px;
  } */
  .drawer__footer {
    margin-top: 20px;
  }
  .search-input {
    width: 350px;
  }

}
</style>
