import {
  Stream,
  Sink,
  Scheduler,
  Source,
  Disposable
} from "most";

export default function multicast<A>(s: Stream<A>): Stream<A>;

export class MulticastSource<A> implements Source<A>, Sink<A> {
  constructor(source: Source<A>);
  run(sink: Sink<A>, scheduler: Scheduler): Disposable<A>;
  add(sink: Sink<A>): number;
  remove(sink: Sink<A>): number;
  event(time: number, value: A): void;
  end(time: number, value: A): void;
  error(time: number, err: Error): void;
}
