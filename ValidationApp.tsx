import React, { useRef } from 'react'
import { SafeAreaView, ScrollView, StatusBar, Text, View, Picker, DatePickerIOS, Switch } from 'react-native'
import styled from 'styled-components'
import {
  TextInput,
  Provider as PaperProvider,
  DefaultTheme,
  HelperText,
  Searchbar,
  Button,
  Checkbox,
  ActivityIndicator,
} from 'react-native-paper'
import { Formik } from 'formik'
import { AirbnbRating } from 'react-native-ratings'
import * as Yup from 'yup'

const theme = {
  ...DefaultTheme,
  roundness: 10,
}

const MainContainer = styled(View)`
  flex: 1;
  background-color: cornflowerblue;
`

const StyledSafeAreaView = styled(SafeAreaView)`
  flex: 1;
`

const FormWrapper = styled(View)`
  flex: 1;
  align-items: center;
`

const Wrapper = styled(View)`
  width: 100%;
  align-items: center;
  justify-content: space-between;
`

const Header = styled(Text)`
  font-size: 32px;
  font-weight: bold;
`

const StyledTextInput = styled(TextInput)`
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: cornflowerblue;
`

const Row = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
`

const Label = styled(Text)`
  font-size: 22px;
  color: black;
`

const StyledSearchbar = styled(Searchbar)`
  background-color: cornflowerblue;
  margin-bottom: 40px;
`

const CheckboxWrapper = styled(View)`
  background-color: white;
  border-radius: 50px;
`

const StyledHelperText = styled(HelperText)`
  margin-bottom: 5px;
`

const StyledPicker = styled(Picker)`
  align-self: stretch;
`

const StyledDatePickerIOS = styled(DatePickerIOS)`
  align-self: stretch;
`

// Yup validation schema example
const formSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  firstName: Yup.string()
    .when('email', {
      // is: val => val && val.length === 8,
      is: 'bb@bb.co',
      then: Yup.string().min(8),
      otherwise: Yup.string().max(8),
    })
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  birthDate: Yup.date()
    .min('2019-11-15', 'No one lives that long')
    .max(new Date(), 'Too late'),
  acceptTerms: Yup.string().matches(/^checked$/, 'gotta accept the terms!'),
  isSmart: Yup.bool().oneOf([true], 'need to be sane!'),
  cardNumber: Yup.number()
    .min(16, 'must be exactly 16 digits')
    .max(16, 'must be exactly 16 digits'),
  cardCVVNumber: Yup.number()
    .min(100, 'must be 3 digits')
    .required(),
  cardExpirationDate: Yup.string()
    .typeError('Not a valid expiration date. Example: MM/YY')
    .length(5, 'Not a valid expiration date. Example: MM/YY')
    .matches(/([0-9]{2})\/([0-9]{2})/, 'Not a valid expiration date. Example: MM/YY')
    .test('test-credit-card-expiration-date', 'Invalid Expiration Date has past', expirationDate => {
      if (!expirationDate) {
        return false
      }

      const today = new Date()
      const monthToday = today.getMonth() + 1
      const yearToday = today
        .getFullYear()
        .toString()
        .substr(-2)

      const [expMonth, expYear] = expirationDate.split('/')

      if (Number(expYear) < Number(yearToday)) {
        return false
      } else if (Number(expMonth) < monthToday && Number(expYear) <= Number(yearToday)) {
        return false
      }

      return true
    })
    .test('test-credit-card-expiration-date', 'Invalid Expiration Month', expirationDate => {
      if (!expirationDate) {
        return false
      }
      const [expMonth] = expirationDate.split('/')

      if (Number(expMonth) > 12) {
        return false
      }

      return true
    })
    .required('Expiration date is required'),
})

const ValidationApp = () => {
  const ratingRef = useRef(null)

  return (
    <PaperProvider theme={theme}>
      <MainContainer>
        <StatusBar barStyle="dark-content" />
        <StyledSafeAreaView>
          <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ marginHorizontal: 30 }}>
            <Wrapper>
              <Header>Formik & Yup</Header>
            </Wrapper>
            <Formik
              initialValues={{
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                gender: 'female',
                isSmart: true,
                birthDate: new Date(),
                reactNativeRating: 3,
                search: '',
                acceptTerms: 'unchecked',
                cardNumber: '',
                cardCVVNumber: '',
                cardExpirationDate: '',
              }}
              onSubmit={async (values, { setStatus }) => {
                await new Promise(resolve => setTimeout(resolve, 3000))
                setStatus({ everythingCool: 'it sure is!' })
                console.log(values)
                return true
              }}
              validateOnChange={false}
              initialStatus={{ everythingCool: 'nope' }}
              onReset={() => (ratingRef.current as any).starSelectedInPosition(3)}
              validationSchema={formSchema}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                setFieldValue,
                handleReset,
              }) => {
                return (
                  <FormWrapper>
                    <StyledTextInput
                      mode="outlined"
                      label="email"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      error={!!errors.email && touched.email}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                    <StyledHelperText type="error" visible={!!(errors.email && touched.email)}>
                      {errors.email}
                    </StyledHelperText>

                    <StyledTextInput
                      mode="outlined"
                      label="password"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      error={!!errors.password && touched.password}
                      secureTextEntry={true}
                    />
                    <StyledHelperText type="error" visible={!!(errors.password && touched.password)}>
                      {errors.password}
                    </StyledHelperText>

                    <StyledTextInput
                      mode="outlined"
                      label="first name"
                      value={values.firstName}
                      onChangeText={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      error={!!errors.firstName && touched.firstName}
                    />
                    <StyledHelperText type="error" visible={!!(errors.firstName && touched.firstName)}>
                      {errors.firstName}
                    </StyledHelperText>

                    <StyledTextInput
                      mode="outlined"
                      label="last name"
                      value={values.lastName}
                      onChangeText={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      error={!!errors.lastName && touched.lastName}
                    />
                    <StyledHelperText type="error" visible={!!(errors.lastName && touched.lastName)}>
                      {errors.lastName}
                    </StyledHelperText>

                    <StyledTextInput
                      mode="outlined"
                      label="card number"
                      value={values.cardNumber}
                      onChangeText={handleChange('cardNumber')}
                      onBlur={handleBlur('cardNumber')}
                      error={!!errors.cardNumber && touched.cardNumber}
                      keyboardType="numeric"
                    />
                    <StyledHelperText type="error" visible={!!(errors.cardNumber && touched.cardNumber)}>
                      {errors.cardNumber}
                    </StyledHelperText>

                    <StyledTextInput
                      mode="outlined"
                      label="CVV"
                      value={values.cardCVVNumber}
                      onChangeText={handleChange('cardCVVNumber')}
                      onBlur={handleBlur('cardCVVNumber')}
                      error={!!errors.cardCVVNumber && touched.cardCVVNumber}
                      keyboardType="numeric"
                      maxLength={3}
                    />
                    <StyledHelperText type="error" visible={!!(errors.cardCVVNumber && touched.cardCVVNumber)}>
                      {errors.cardCVVNumber}
                    </StyledHelperText>

                    <StyledTextInput
                      mode="outlined"
                      label="card expiration date"
                      value={values.cardExpirationDate}
                      onChangeText={handleChange('cardExpirationDate')}
                      onBlur={handleBlur('cardExpirationDate')}
                      error={!!errors.cardExpirationDate && touched.cardExpirationDate}
                    />
                    <StyledHelperText
                      type="error"
                      visible={!!(errors.cardExpirationDate && touched.cardExpirationDate)}
                    >
                      {errors.cardExpirationDate}
                    </StyledHelperText>

                    <Label>gender:</Label>
                    <StyledPicker selectedValue={values.gender} onValueChange={handleChange('gender')}>
                      <Picker.Item label="male" value="male" />
                      <Picker.Item label="female" value="female" />
                      <Picker.Item label="other" value="other" />
                    </StyledPicker>

                    <StyledSearchbar placeholder="Search" onChangeText={handleChange('search')} value={values.search} />
                    <StyledHelperText type="error" visible={!!(errors.search && touched.search)}>
                      {errors.search}
                    </StyledHelperText>

                    <Label>date of birth:</Label>
                    <StyledDatePickerIOS
                      date={values.birthDate}
                      onDateChange={date => {
                        setFieldValue('birthDate', date)
                      }}
                    />
                    <StyledHelperText type="error" visible={!!(errors.birthDate && touched.birthDate)}>
                      {errors.birthDate}
                    </StyledHelperText>

                    <Row>
                      <Label>i am smart</Label>
                      <Switch
                        value={values.isSmart}
                        onValueChange={(value: boolean) => setFieldValue('isSmart', value)}
                        disabled={false}
                        trackColor={{ true: 'green', false: 'grey' }}
                        thumbColor="white"
                        ios_backgroundColor="grey"
                      />
                    </Row>
                    <StyledHelperText type="error" visible={!!(errors.isSmart && touched.isSmart)}>
                      {errors.isSmart}
                    </StyledHelperText>

                    <Label>please rate react native:</Label>
                    <AirbnbRating
                      count={5}
                      reviews={['Terrible', 'Bad', 'OK', 'Good', 'Very Good']}
                      defaultRating={3}
                      size={20}
                      onFinishRating={rating => setFieldValue('isSmart', rating > 2)}
                      ref={ratingRef}
                    />

                    <Row>
                      <Label>I accept this and that</Label>
                      <CheckboxWrapper>
                        <Checkbox
                          status={values.acceptTerms as any}
                          onPress={() =>
                            setFieldValue('acceptTerms', values.acceptTerms === 'checked' ? 'unchecked' : 'checked')
                          }
                          disabled={false}
                          color="green"
                        />
                      </CheckboxWrapper>
                    </Row>
                    <StyledHelperText type="error" visible={!!(errors.acceptTerms && touched.acceptTerms)}>
                      {errors.acceptTerms}
                    </StyledHelperText>

                    {isSubmitting ? (
                      <ActivityIndicator size="large" />
                    ) : (
                      <Button onPress={handleSubmit}>
                        <Label>Submit!</Label>
                      </Button>
                    )}

                    <Button onPress={handleReset}>
                      <Label>Reset form</Label>
                    </Button>
                  </FormWrapper>
                )
              }}
            </Formik>
          </ScrollView>
        </StyledSafeAreaView>
      </MainContainer>
    </PaperProvider>
  )
}

export default ValidationApp
