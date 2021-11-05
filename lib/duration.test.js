import { Duration } from './duration';

describe('Duration', () => {
  it('should return duration in minutes', function() {
    expect(Duration.of({ minutes: 60 }).inMinutes).toEqual(60);
  });

  it('should return duration in milliseconds', function() {
    expect(Duration.of({ minutes: 60 }).inMilliseconds).toEqual(3600000);
  });

  it('should return duration in hours', function() {
    expect(Duration.of({ minutes: 60 }).inHours).toEqual(1);
  });

  it('should return in days', function() {
    expect(Duration.of({ days: 1 }).inDays).toEqual(1);
  });

  it('should round days', function() {
    expect(Duration.of({ hours: 24 }).inDays).toEqual(1);
    expect(Duration.of({ minutes: 60 }).inDays).toEqual(0);
  });

  it('should convert timestamp to duration', function() {
    expect(Duration.of(3600000).inMilliseconds).toEqual(3600000);
  });

  it('should test is negative duration or not', function() {
    expect(Duration.of({ minutes: 30 }).isNegative).toEqual(false);
    expect(Duration.of({ minutes: -30 }).isNegative).toEqual(true);
  });

  it('should convert duration to absolute value', function() {
    expect(
      Duration.of({ minutes: -30 })
        .abs()
        .compareTo(Duration.of({ minutes: 30 }))
    ).toEqual(0);
  });

  it('should compare two durations', function() {
    expect(
      Duration.of({ minutes: 60 }).compareTo(Duration.of({ minutes: 30 }))
    ).toEqual(
      Duration.of({ minutes: 30 }).inMilliseconds
    );

    expect(
      Duration.of({ minutes: 60 }).compareTo(Duration.of({ minutes: 60 }))
    ).toEqual(0);

    expect(
      Duration.of({ minutes: 60 }).compareTo(Duration.of({ minutes: 90 }))
    ).toEqual(
      Duration.of({ minutes: -30 }).inMilliseconds
    );
  });
});