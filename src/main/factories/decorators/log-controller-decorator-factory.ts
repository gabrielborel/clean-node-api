import { MongoLogRepository } from "@/infra/db/mongodb/log/mongo-log-repository";
import { Controller } from "@/presentations/protocols";
import { LogControllerDecorator } from "@/main/decorators/log-controller-decorator";

export const makeLogControllerDecorator = (
  controller: Controller
): Controller => {
  const mongoLogRepository = new MongoLogRepository();
  return new LogControllerDecorator(controller, mongoLogRepository);
};
