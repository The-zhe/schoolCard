<template>
	<div class="login">
		<div class="lg_main">
			<div class="lg-t0">
				<img src="@/assets/logo.png" alt="" />
				<p>
					{{ environment == '测试' ? '云教研平台-备课端' : '美时美课课堂' }}
				</p>
			</div>
			<p class="lg-t1">致力于为老师和学生创造更多美好的闲暇时光</p>
			<div class="lg_name">
				<div class="lg-n2">登&nbsp;录</div>
			</div>
			<div class="lg">
				<div class="lg_left">
					<div class="code">
						<img :src="qrUrl" alt="" />
					</div>
					<div class="invalid_code" v-if="iscode">
						<div class="invalid">二维码已失效</div>
						<el-button class="refresh" @click="refresh()">请点击刷新</el-button>
					</div>
					<div class="code_text">用手机端扫描二维码登录</div>
				</div>
				<div class="lg_right">
					<div class="load_text">密码登录</div>
					<el-input
						placeholder="请输入手机号"
						prefix-icon="el-icon-phone-outline"
						v-model="mobile"
						class="input-with-select"
						style="width: 343px"
					></el-input>
					<div style="position: relative">
						<el-input
							type="password"
							placeholder="请输入密码"
							prefix-icon="el-icon-lock"
							:maxlength="12"
							:show-password="false"
							v-model="password"
							class="input-with-select"
							style="width: 343px; margin: 20px 0 30px 0"
						></el-input>
						<div class="pwd-tip">
							<div class="f1">
								<el-checkbox v-model="isCheck"
									>记住密码<span class="cof"
										>(请不要在公共电脑上勾选)</span
									></el-checkbox
								>
							</div>
							<router-link to="forget" class="forget">忘记密码？</router-link>
						</div>
					</div>

					<!-- <div class="load_yz">
            <el-input
              placeholder="请输入验证码"
              prefix-icon="el-icon-key"
              v-model="verification"
              class="input-with-select"
            ></el-input>
            <el-button round :class="isYz ? 'cf_yz' : 'yz'" @click="getYz()">{{
              code
            }}</el-button>
          </div>
          <p style="text-align: center" v-if="environment">
            {{ environment }}环境
          </p>
          <el-button class="load" @click="load">登录</el-button> -->
					<p style="text-align: center" v-if="environment">
						{{ environment }}环境
					</p>
					<el-button class="load" @click="load">登录</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		toLogin,
		getSendMsg,
		getRole,
		toMsgCodeLogin,
		getLoginQrCode,
		qrCheckToken,
		teacherLogin,
	} from '@/api/login';
	import { encryption } from '@/utils';
	export default {
		components: {},
		data() {
			return {
				mobile: '',
				password: '',
				type: '1',
				verification: '',
				password: '',
				iscode: false,
				seconds: 30,
				isYz: false,
				yz_code: '验证码',
				cf_code: '重发',
				code: '验证码',
				qrUrl: '',
				timer: null,
				timer2: null,
				environment: '',
				loginData: {
					username: 'test_teacher001',
					password: '123456',
				},
				isCheck: false,
			};
		},
		mounted() {
			let name = '';
			switch (args_type) {
				case 'test':
					name = '测试';
					break;
				case 'pre':
					name = '演示';
					break;
			}
			this.environment = name;
			this.$store.commit('logout', false);
			let isCheck = localStorage.getItem('userLogin') || '';
			this.isCheck = isCheck ? true : false;
			if (this.isCheck) {
				let { username, password } = JSON.parse(
					localStorage.getItem('userLogin')
				);
				this.mobile = username;
				this.password = password;
			}

			this.getLoginQrCode();
		},
		methods: {
			async getLoginQrCode() {
				if (this.timer) {
					clearTimeout(this.timer);
				}
				if (this.timer2) {
					clearInterval(this.timer2);
				}
				const { data } = await getLoginQrCode();
				this.qrUrl = data.base64img;
				this.timer = setTimeout(() => {
					this.iscode = true;
					clearTimeout(this.timer);
					clearInterval(this.timer2);
				}, data.effective * 1000);
				this.timer2 = setInterval(() => {
					qrCheckToken(data.uuid).then(
						(res) => {
							clearTimeout(this.timer);
							clearInterval(this.timer2);
							this.callback(JSON.parse(res.data));
						},
						(err) => {}
					);
				}, 1000);
			},
			refresh() {
				this.iscode = false;
				this.qrUrl = '';
				this.getLoginQrCode();
			},
			getYz() {
				const arg1 =
					/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|17[0-9]{1}|(18[0-9]{1})|(19[0-9 {4}]{1}))+\d{8})$/;
				if (this.mobile === '' || !arg1.test(this.mobile)) {
					return this.$message({
						message: '请输入正确的手机号码',
						type: 'info',
					});
				}
				this.seconds = 30;
				this.isYz = true;
				this.code = `${this.cf_code}(${this.seconds})`;
				const time = setInterval(() => {
					this.seconds--;
					this.code = `${this.cf_code}(${this.seconds})`;
					if (this.seconds <= 0) {
						clearInterval(time);
						this.code = `${this.cf_code}`;
						this.isYz = false;
					}
				}, 1000);
				getSendMsg(this.mobile)
					.then((res) => {
						this.$message({
							message: '发送成功',
							type: 'success',
						});
					})
					.catch((res) => {
						clearInterval(time);
						this.code = `${this.cf_code}`;
						this.isYz = false;
					});
			},
			load() {
				const arg1 =
					/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|17[0-9]{1}|(18[0-9]{1})|(19[0-9 {4}]{1}))+\d{8})$/;
				if (this.mobile === '' || !arg1.test(this.mobile)) {
					return this.$message({
						message: '请输入正确的手机号码',
						type: 'info',
					});
				}
				if (!this.password) {
					return this.$message({
						message: '请输入密码',
						type: 'info',
					});
				}

				let data = {
					username: this.mobile,
					password: this.password,
				};

				teacherLogin(data).then((res) => {
					if (this.isCheck) {
						localStorage.setItem('userLogin', JSON.stringify(data));
					} else {
						localStorage.removeItem('userLogin');
					}
					this.callback(JSON.parse(res.data));
				});

				/* if (!this.verification) {
        return this.$message({
          message: "请输入验证码",
          type: "info",
        });
      }
      let data = {
        mobile: `SMS@${this.mobile}`,
        code: this.verification,
        grant_type: "mobile",
        type: 2,
      };
      toMsgCodeLogin(data)
        .then((res) => {
          this.callback(res);
        })
        .catch((res) => {
          console.log("res", res);
          // this.$message({
          //   type: "error",
          //   message: '11111111',
          // });
        }); */
			},
			async callback(res) {
				this.$store.commit('login', res);
				getRole().then(({ data: { roles } }) => {
					if (roles.includes(3)) {
						setTimeout(() => {
							this.$store
								.dispatch('getTeacherByUser', true)
								.then((res) => {
									this.$router.push({
										path: '/lessonPreparation/planManagement',
									});
								})
								.catch((e) => {});
						}, 100);
					} else {
						this.$message({
							message: '您不是教师，请确认账号是否正确',
							type: 'error',
						});
					}
				});
			},
			async toLogin() {
				try {
					const user = encryption({
						data: this.loginData,
						key: 'pigxpigxpigxpigx',
						param: ['password'],
					});
					const { access_token, user_info } = await toLogin(user);
					this.$store.commit('login', {
						access_token: access_token,
						user: user_info,
						headImg: user_info.avatar,
					});
					setTimeout(() => {
						this.$store.dispatch('getTeacherByUser', true).then((res) => {
							// this.$router.push({ path: "/home" });
							this.$router.push({ path: '/lessonPreparation/planManagement' });
						});
					}, 100);
				} catch (e) {
					console.log(e);
				}
			},
		},
		filters: {},
		beforeRouteLeave(to, from, next) {
			clearTimeout(this.timer);
			clearInterval(this.timer2);
			next();
		},
	};
</script>
<style lang="less" scoped>
	.pwd-tip {
		display: flex;
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		.cof {
			color: #ccc;
			margin-left: 5px;
		}

		.f1 {
			flex: 1;
			overflow: hidden;
		}
		.forget {
			cursor: pointer;
		}
	}
	.login {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #fff;
		background: url('../../assets/loginBg.png') no-repeat;
		background-size: cover;
		-webkit-background-size: cover;
		-o-background-size: cover;
		background-position: center 0;

		.lg_main {
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			display: flex;
			flex-direction: column;
			width: 930px;
			height: 570px;
			padding: 30px 80px;
			margin: auto;
			background: rgba(0, 0, 0, 0.25);
			border-radius: 5px;

			.lg-t0 {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 35px;
				color: #fff;
				margin-bottom: 25px;

				img {
					width: 45px;
					height: 45px;
					margin-right: 10px;
				}
			}

			.lg-t1 {
				margin-bottom: 40px;
				font-size: 20px;
				text-align: center;
				color: #fff;
			}

			.lg_name {
				color: #fff;
				text-align: center;
				font-size: 24px;
				margin-bottom: 32px;
				height: 1px;
				position: relative;

				.lg-n2 {
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
				}
				&::before,
				&::after {
					content: '';
					width: 40%;
					position: absolute;
					height: 1px;
					background: #fff;
					top: 0;
				}
				&::before {
					left: 0;
				}
				&::after {
					right: 0;
				}
			}
			.lg {
				display: flex;
				flex-direction: row;
				height: 100%;
				width: 100%;
				background-color: #fff;
				padding: 20px;
				border-radius: 5px;
				.lg_left {
					position: relative;
					display: flex;
					flex-direction: column;
					padding-right: 40px;
					border-right: 1px dashed #707070;
					.code {
						height: 220px;
						width: 220px;
						margin-top: 40px;
						margin-left: 30px;
						img {
							width: 100%;
							height: 100%;
						}
					}
					.invalid_code {
						position: absolute;
						display: flex;
						flex-direction: column;
						height: 220px;
						width: 220px;
						top: 40px;
						left: 30px;
						background-color: rgba(255, 255, 255, 0.9);
						.invalid {
							color: #000;
							font-size: 24px;
							text-align: center;
							margin-top: 60px;
						}
						.refresh {
							margin: 30px auto 0px;
							font-size: 12px;
							color: #fff;
							background-image: linear-gradient(to right, #7cd9c0, #03ab8a);
							width: 160px;
						}
					}
					.code_text {
						color: #707070;
						text-align: center;
						font-size: 18px;
						margin-left: 30px;
						margin-top: 10px;
					}
				}
				.lg_right {
					display: flex;
					flex-direction: column;
					padding-left: 40px;
					margin-top: 40px;
					.load_text {
						color: #1d1d1d;
						margin-bottom: 20px;
						font-size: 22px;
					}
					.load_yz {
						display: flex;
						flex-direction: row;
						margin: 20px 0px;
						.yz {
							background: #00b584;
							color: #fff;
							margin-left: 20px;
							cursor: pointer;
						}
						.cf_yz {
							background: #707070;
							color: #fff;
							margin-left: 20px;
							pointer-events: none;
						}
					}
					.load {
						margin-top: 30px;
						font-size: 18px;
						color: #fff;
						background-image: linear-gradient(to right, #7cd9c0, #03ab8a);
					}
				}
			}
		}
	}
</style>
