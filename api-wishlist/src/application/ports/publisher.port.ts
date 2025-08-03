export abstract class PublisherPort<T> {
  abstract publish(action: string, payload: T): Promise<void>;
}
