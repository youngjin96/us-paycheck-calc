import { describe, expect, it } from "vitest";
import { resolveSiteUrl } from "./site";

/**
 * CI 가 미설정 변수를 빈 문자열로 넘겨 new URL("") 이 터진 적이 있다.
 * 같은 회귀를 막기 위한 테스트.
 */
describe("resolveSiteUrl", () => {
  it("빈 문자열·공백·undefined 는 기본값으로 되돌린다", () => {
    for (const input of ["", "   ", undefined]) {
      expect(resolveSiteUrl(input)).toBe("https://example.com");
    }
  });

  it("끝 슬래시를 제거한다", () => {
    expect(resolveSiteUrl("https://paychecklab.com/")).toBe("https://paychecklab.com");
    expect(resolveSiteUrl("https://paychecklab.com///")).toBe("https://paychecklab.com");
  });

  it("정상 URL 은 그대로 통과시킨다", () => {
    expect(resolveSiteUrl("https://paychecklab.com")).toBe("https://paychecklab.com");
  });

  it("URL 로 파싱되지 않거나 http(s) 가 아니면 기본값으로 되돌린다", () => {
    expect(resolveSiteUrl("paychecklab.com")).toBe("https://example.com");
    expect(resolveSiteUrl("not a url")).toBe("https://example.com");
    expect(resolveSiteUrl("ftp://paychecklab.com")).toBe("https://example.com");
  });

  it("반환값은 항상 new URL() 에 넣을 수 있다", () => {
    for (const input of ["", "junk", "https://ok.com/"]) {
      expect(() => new URL(resolveSiteUrl(input))).not.toThrow();
    }
  });
});
