<template>
	<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
		<div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <!-- <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company"> -->

    <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
		v-text="signIn ? 'Sign in to your account' : 'Sign up'"
		></h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <Form @submit="onSubmit" :validation-schema="formData" class="space-y-6">

			<!-- Username Field -->
			<div v-if="!signIn">

        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Username</label>

        <div class="mt-2">
					<Field
					name="username"
					v-slot="{ field, errors, errorMessage }"
				>

          <input id="username" name="username" type="text"
					v-bind="field"
					autocomplete="username" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">

					<!-- <div class="input_alert" v-if="errors.length !== 0">
						{{ errorMessage }}
					</div> -->
				</Field>
        </div>

      </div>

			<!-- Email Field -->
      <div>

        <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>

        <div class="mt-2">

					<Field
					name="email"
					v-slot="{ field, errors, errorMessage }"

				>
          <input id="email" name="email" type="email"
					v-bind="field"
					autocomplete="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
					<!-- <div class="input_alert" v-if="errors.length !== 0">
						{{ errorMessage }}
					</div> -->
				</Field>
        </div>

      </div>

			<!-- Password Field -->
      <div>
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
          <!-- <div class="text-sm">
            <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
          </div> -->
        </div>
        <div class="mt-2">
					<Field
					name="password"
					v-slot="{ field, errors, errorMessage }"
				>

          <input id="password" name="password" type="password"
					v-bind="field"
					 required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
					<!-- <div class="input_alert" v-if="errors.length !== 0">
						{{ errorMessage }}
					</div> -->
				</Field>
        </div>
      </div>

				<div>

					<button
						type="submit"
						class="flex w-full justify-center rounded-md bg-blue-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
						v-text="signIn ? 'Sign in' : 'Sign up'"
					></button>

				</div>
			</Form>

			<p class="mt-10 text-center text-sm text-gray-500">

				<span v-text="signIn ? 'Not a member? ' : 'Already a member? '"></span>

				<div class="inline cursor-pointer select-none" @click="signIn = !signIn">

					<a v-if="!signIn"	class="font-semibold leading-6 text-blue-700 hover:text-blue-800">
						Sign In
					</a>

					<a v-else class="font-semibold leading-6 text-blue-700 hover:text-blue-800">
						Sign Up
					</a>

				</div>

			</p>

		</div>
	</div>
</template>
<script>
import { Field, Form } from 'vee-validate';
import * as yup from 'yup';

export default {
	components: {
		Form,
		Field,
	},
	data() {
		return {
			signIn: true,
			formData: {
				userName: yup.string(),
				email: yup
					.string()
					.required('Email is required')
					.email('Not a valid email'),
				password: yup.string().required('The password is required'),
			},
		};
	},
	methods: {
		onSubmit(values, { resetForm }) {
			if (this.signIn) {
				console.log("fdf");
				// sign in
				this.$store.dispatch('auth/signin', values);
			} else {
				//sign up
				this.$store.dispatch('auth/signup', values);
			}
			resetForm();
		},
	},
};
</script>
<style scoped>
input {
	padding-left: 8px;
}
</style>
