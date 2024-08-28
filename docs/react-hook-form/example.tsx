import { Alert, Button, Text, TextInput, View } from "react-native";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type Input = {
  firstName: string;
  lastName: string;
  age: number;
};

/**
 * Example of a form using react-hook-form.
 */
function App() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Input>();
  const onSubmit: SubmitHandler<Input> = (data) => console.log(data);

  // The Controller component is used to register inputs into react-hook-form.
  return (
    <View>
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput onChangeText={onChange} onBlur={onBlur} value={value} />
        )}
        name="firstName"
      />
      {errors.firstName && <Text>This is required.</Text>}
      <Controller
        control={control}
        rules={{ pattern: /^[A-Za-z]+$/i }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput onChangeText={onChange} onBlur={onBlur} value={value} />
        )}
        name="lastName"
      />
      <Controller
        control={control}
        rules={{ min: 10, max: 99 }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput onChangeText={onChange} onBlur={onBlur} value={value} />
        )}
        name="age"
      />
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
