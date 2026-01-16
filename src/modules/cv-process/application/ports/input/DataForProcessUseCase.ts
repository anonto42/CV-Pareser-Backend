import { ProcessDataFormet } from "../../dto/ProcessingDataFormet.dto";

export interface DataForProcessUseCase {
  execute(data: ProcessDataFormet): Promise<void>;
}
