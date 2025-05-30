import { ToImport, ImpExtendInterface } from "./test-imports.types.js";
import { TemplateResult } from "lit";

interface Foo {
  one: string;
  two: boolean;
}

type Bar = "One" | "Two" | false | null;

interface TheInterface {
  one: number;
  two: string;
  three: string | TemplateResult;
  sub: SubInterface;
  subSpecialArray: Array<OtherInterface>;
  subArray: OtherInterfaceTwo[];
  subType: SubType;
  subUnion: UnionFoo | UnionBar;
  onlyType: TheOnlyType;
}

interface TupleInterface {
  subTuple: [TupleFoo];
  multipleTuple: [TupleFooBar, TupleBar, TupleBaz];
}

interface UnionInterface {
  union: UnionFoo | UnionBar;
}

type TheOnlyType = SubOnlyType;

interface SubOnlyType { }

type TheType = "One" | "Two" | SubInterface | Array<OtherInterface> | OtherInterfaceTwo[];

interface SubInterface {

}

interface OtherInterface {
}

interface NoChild {
  foo: string;
  bar: number;
  bool: boolean;
}

interface OtherInterfaceTwo {

}

type SubType = "fooFromSub";

interface UnionFoo {
  sub: SubUnionFoo;
}

interface SubUnionFoo {
}

interface UnionBar {
  sub: SubUnionBar;
}

interface SubUnionBar {

}

interface TupleFoo {

}
interface TupleBar {

}

interface TupleBaz {

}

interface TupleFooBar {
}

interface ShouldBeIgnored {

}

interface CycleTest {
  sub: SubCycleTest;
  itself: CycleTest;
}

interface SubCycleTest {
  parent: CycleTest;
  child: MoreCycleTest;
  itself: SubCycleTest;
}

interface MoreCycleTest {
  parent: CycleTest;
  parent2: SubCycleTest;
  itself: MoreCycleTest;
}

interface PrivateInterface {

}

interface ToBeExtended extends ExtendedInterface {

}

interface ExtendedInterface extends AnotherExtendsInt {

}

interface AnotherExtendsInt {

}

interface toBeImpExtended extends ImpExtendInterface {

}
