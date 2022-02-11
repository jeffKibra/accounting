import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import Card, { CardContent } from "../../ui/Card";

function CustomerForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "onChange" });
  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel></FormLabel>
            <Input {...register("type")} />
            <FormErrorMessage>{errors?.type?.message}</FormErrorMessage>
          </FormControl>
        </form>
      </CardContent>
    </Card>
  );
}

export default CustomerForm;
