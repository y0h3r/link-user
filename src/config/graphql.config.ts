import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

export const GraphQLConfig = GraphQLModule.forRootAsync<ApolloDriverConfig>({
  driver: ApolloDriver,
  inject: [ConfigService],
  useFactory: () => ({
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  }),
});
