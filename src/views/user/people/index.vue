<template lang="html">
  <div class="app-container">
    <h3 class="title">基础设置</h3>
    <div class="people">
      <div class="people_left">
        <el-form ref="dataForm" label-position="top" :model="dataForm" label-width="80px"  :rules="rules">
          <el-form-item label="账号" prop="role_name">
            <el-input type='text' :maxlength="20" size='small' v-model.trim="dataForm.role_name" placeholder="" style="width:100%">
            </el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="role_name">
            <el-input type='text' :maxlength="20" size='small' v-model.trim="dataForm.role_name" placeholder="" style="width:100%">
            </el-input>
          </el-form-item>
          <el-form-item label="个人简介" prop="role_name">
            <el-input type="textarea" :rows="3"  size='small' v-model.trim="dataForm.role_name" placeholder="" style="width:100%">
            </el-input>
          </el-form-item>
          <div style="text-align: center;">
            <el-button @click="onSubmit" type='primary' size='small'>确定</el-button>
          </div>
        </el-form>
      </div>
      <div class="people_right">
        <div class="people_img">
          <img src="../../../assets/user.png" alt="">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleChange"
            :file-list="fileList">
            <el-button size="small" type="text" icon="el-icon-upload">更换头像</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </div>
      </div>
    </div>
    <h3 class="title" style="marginTop: 20px;">密码设置</h3>
    <div class="people">
      <div class="people_left">
        <el-form ref="dataForm" label-position="top" :model="dataForm" label-width="80px"  :rules="rules">
          <el-form-item label="原密码" prop="role_name">
            <el-input type='text' :maxlength="20" size='small' v-model.trim="dataForm.role_name" placeholder="" style="width:100%">
            </el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="role_name">
            <el-input type='text' :maxlength="20" size='small' v-model.trim="dataForm.role_name" placeholder="" style="width:100%">
            </el-input>
          </el-form-item>
          <div style="text-align: center;">
            <el-button @click="onSubmit" type='primary' size='small'>确定</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dataForm: {},
      rules: {}
    }
  },
  methods: {
    onSubmit () {}
  }
}
</script>

<style lang="scss" scoped>
h3,p { padding: 0; margin: 0;}
.title {
  margin-bottom: 20px;
}
.people {
  display: flex; justify-content: flex-start; margin: 0 30px;
  .people_left {
    width: 40%;
  }
  .people_right {
    width: 50%; text-align: center;
    .people_img {
      img { width: 150px; height: 150px; }
      .upload-demo { margin-top: 10px; }
    }
  }

}
</style>
