import { ReflectionService } from '@grpc/reflection';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'proto',
    protoPath: [
      join(__dirname, './proto/customer.proto'),
      join(__dirname, './proto/employee.proto'),
      join(__dirname, './proto/order.proto'),
      join(__dirname, './proto/report.proto'),
      join(__dirname, './proto/restaurant.proto'),
      join(__dirname, './proto/table.proto'),
    ],
    onLoadPackageDefinition: (pkg, server) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      new ReflectionService(pkg).addToServer(server);
    },
  },
};
